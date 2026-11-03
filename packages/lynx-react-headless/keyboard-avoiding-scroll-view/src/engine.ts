import {
  calculateSafeArea,
  calculateSignedScrollDelta,
  clampScrollOffset,
  createFieldBodyRect,
  hasMeaningfulGeometryChange,
  selectLargestFittingTarget,
  type AvoidanceTargetKind,
  type VerticalRect,
} from "./geometry.js";
import { KEYBOARD_CLOSE_DURATION_MS } from "./motion.js";
import type { KeyboardOcclusion, RawKeyboardState, ScrollMetrics } from "./native-driver.js";

const BLUR_HANDOFF_DELAY_MS = 30;

export interface RefLike<Node> {
  current: Node | null;
}

/**
 * `"footer"`는 Footer 안의 입력이다. Footer가 키보드 위로 올라가므로 Content를 스크롤하지 않는다.
 */
export type KeyboardAvoidancePlacement = "content" | "footer";

export interface KeyboardAvoidanceRegistration<Node> {
  owner: object;
  nativeRef: RefLike<Node>;
  controlRef?: RefLike<Node>;
  fieldRef?: RefLike<Node>;
  anchorRef?: RefLike<Node>;
  enabled?: boolean;
  /** @default "content" */
  placement?: KeyboardAvoidancePlacement;
}

export interface KeyboardAvoidingNativeDriver<Node> {
  measure(node: Node): Promise<VerticalRect | null>;
  resolveKeyboardOcclusion(state: RawKeyboardState): Promise<KeyboardOcclusion | null>;
  /** `animated`이면 높이를 바로 바꾸지 않고 전환한다. 키보드가 닫힌 뒤 Content가 한 번에 내려앉지 않게 한다. */
  setSpacerHeight(node: Node, height: number, animated: boolean): void;
  waitForLayout(): Promise<void>;
  getScrollMetrics(node: Node, viewportHeight: number): Promise<ScrollMetrics | null>;
  scrollTo(node: Node, offset: number, smooth: boolean): void;
}

type ScheduledCallback = () => void | Promise<void>;
type CancelScheduledCallback = () => void;

export interface KeyboardAvoidingScheduler {
  scheduleFrame(callback: ScheduledCallback): CancelScheduledCallback;
  scheduleTimer(callback: ScheduledCallback, delayMs: number): CancelScheduledCallback;
}

export interface KeyboardAvoidingEngineOptions<Node> {
  driver: KeyboardAvoidingNativeDriver<Node>;
  scheduler: KeyboardAvoidingScheduler;
  /** 변형되지 않는 Root 노드다. Footer가 있으면 이 노드가 키보드에 가려진 높이로 Footer 위치를 정한다. */
  getRootNode(): Node | null;
  getScrollNode(): Node | null;
  getSpacerNode(): Node | null;
  hasFooter(): boolean;
  /** Footer를 위로 옮길 거리(px)다. 키보드가 닫히면 0이다. */
  setFooterOffset(offset: number): void;
  /** 예약된 평가를 한 번 마칠 때마다 호출한다. Footer의 첫 위치가 정해졌는지 판단하는 데 쓴다. */
  onEvaluated?(): void;
  getKeyboardGap(): number;
  getToolbarHeight(): number;
  getSmooth(): boolean;
}

export interface KeyboardAvoidingEngine<Node> {
  focus(registration: KeyboardAvoidanceRegistration<Node>): void;
  blur(owner: object): void;
  layoutChanged(owner: object): void;
  unregister(owner: object): void;
  keyboardChanged(state: RawKeyboardState): void;
  viewportChanged(): void;
  userScrollStarted(): void;
  userScrollEnded(): void;
  dispose(): void;
}

type InvalidationReason = "focus" | "keyboard" | "layout" | "scroll" | "viewport";

interface OwnerSessionState {
  session: number;
  fieldDowngraded: boolean;
  lastTargetKind: AvoidanceTargetKind | null;
  lastTargetHeight: number | null;
}

interface Transaction<Node> {
  revision: number;
  session: number;
  registration: KeyboardAvoidanceRegistration<Node> | null;
  keyboard: RawKeyboardState;
  layoutOnly: boolean;
}

function normalizeKeyboardState(state: RawKeyboardState): RawKeyboardState {
  const height = Number.isFinite(state.height) ? Math.max(0, state.height) : 0;
  const visible = state.visible && height > 0;

  return { visible, height: visible ? height : 0 };
}

function targetHeight(rect: VerticalRect): number {
  return Math.max(0, rect.bottom - rect.top);
}

class KeyboardAvoidingEngineImpl<Node> implements KeyboardAvoidingEngine<Node> {
  readonly #options: KeyboardAvoidingEngineOptions<Node>;
  readonly #pendingReasons = new Set<InvalidationReason>();
  readonly #ownerStates = new Map<object, OwnerSessionState>();

  #activeRegistration: KeyboardAvoidanceRegistration<Node> | null = null;
  #keyboard: RawKeyboardState = { visible: false, height: 0 };
  #revision = 0;
  #session = 0;
  #appliedSpacerHeight = 0;
  #appliedFooterOffset = 0;
  #needsCloseClamp = false;
  #cancelFrame: CancelScheduledCallback | null = null;
  #cancelBlur: CancelScheduledCallback | null = null;
  #cancelCloseCleanup: CancelScheduledCallback | null = null;
  #blurOwner: object | null = null;
  #userScrolling = false;
  #disposed = false;

  constructor(options: KeyboardAvoidingEngineOptions<Node>) {
    this.#options = options;
  }

  focus(registration: KeyboardAvoidanceRegistration<Node>): void {
    if (this.#disposed) return;

    this.#cancelPendingBlur();
    if (registration.enabled === false) {
      if (this.#activeRegistration === null) return;

      this.#activeRegistration = null;
      this.#invalidate("focus");
      return;
    }

    this.#activeRegistration = registration;
    this.#invalidate("focus");
  }

  blur(owner: object): void {
    if (this.#disposed || this.#activeRegistration?.owner !== owner) return;

    this.#cancelPendingBlur();
    this.#blurOwner = owner;
    this.#cancelBlur = this.#options.scheduler.scheduleTimer(() => {
      this.#cancelBlur = null;
      const blurOwner = this.#blurOwner;
      this.#blurOwner = null;
      if (this.#activeRegistration?.owner !== blurOwner) return;

      this.#activeRegistration = null;
      this.#invalidate("focus");
    }, BLUR_HANDOFF_DELAY_MS);
  }

  layoutChanged(owner: object): void {
    if (this.#disposed || this.#activeRegistration?.owner !== owner) return;
    this.#invalidate("layout");
  }

  unregister(owner: object): void {
    if (this.#disposed) return;

    this.#ownerStates.delete(owner);
    if (this.#blurOwner === owner) this.#cancelPendingBlur();
    if (this.#activeRegistration?.owner !== owner) return;

    this.#activeRegistration = null;
    this.#invalidate("focus");
  }

  keyboardChanged(state: RawKeyboardState): void {
    if (this.#disposed) return;

    const next = normalizeKeyboardState(state);
    if (
      next.visible === this.#keyboard.visible &&
      !hasMeaningfulGeometryChange(this.#keyboard.height, next.height)
    ) {
      return;
    }

    if (next.visible !== this.#keyboard.visible) {
      this.#session += 1;
      this.#ownerStates.clear();
    }
    this.#keyboard = next;
    // iOS는 입력 밖 touchstart에서 키보드를 닫는다. 측정이 필요 없는 Footer 복귀는
    // 사용자 스크롤이 끝날 때까지 미루지 않고 키보드와 함께 시작한다.
    if (!next.visible) this.#applyFooterOffset(0);
    this.#invalidate("keyboard");
  }

  viewportChanged(): void {
    if (this.#disposed) return;
    this.#invalidate("viewport");
  }

  userScrollStarted(): void {
    if (this.#disposed || this.#userScrolling) return;

    this.#userScrolling = true;
    this.#revision += 1;
    this.#pendingReasons.add("scroll");
    this.#cancelFrame?.();
    this.#cancelFrame = null;
  }

  userScrollEnded(): void {
    if (this.#disposed || !this.#userScrolling) return;

    this.#userScrolling = false;
    this.#invalidate("scroll");
  }

  dispose(): void {
    if (this.#disposed) return;

    this.#disposed = true;
    this.#revision += 1;
    this.#cancelFrame?.();
    this.#cancelFrame = null;
    this.#cancelPendingBlur();
    this.#cancelCloseCleanup?.();
    this.#cancelCloseCleanup = null;
    this.#pendingReasons.clear();
    this.#ownerStates.clear();
    this.#activeRegistration = null;
  }

  #cancelPendingBlur(): void {
    this.#cancelBlur?.();
    this.#cancelBlur = null;
    this.#blurOwner = null;
  }

  #invalidate(reason: InvalidationReason): void {
    this.#revision += 1;
    this.#pendingReasons.add(reason);
    if (this.#userScrolling || this.#cancelFrame !== null) return;

    this.#cancelFrame = this.#options.scheduler.scheduleFrame(async () => {
      this.#cancelFrame = null;
      if (this.#disposed || this.#userScrolling) return;

      const reasons = new Set(this.#pendingReasons);
      this.#pendingReasons.clear();
      const transaction: Transaction<Node> = {
        revision: this.#revision,
        session: this.#session,
        registration: this.#activeRegistration,
        keyboard: this.#keyboard,
        layoutOnly: reasons.size === 1 && reasons.has("layout"),
      };

      await this.#evaluate(transaction);
      if (!this.#disposed) this.#options.onEvaluated?.();
    });
  }

  #isCurrent(transaction: Transaction<Node>): boolean {
    return (
      !this.#disposed &&
      transaction.revision === this.#revision &&
      transaction.session === this.#session &&
      transaction.registration === this.#activeRegistration &&
      !this.#userScrolling
    );
  }

  async #evaluate(transaction: Transaction<Node>): Promise<void> {
    try {
      if (!transaction.keyboard.visible) {
        this.#applyFooterOffset(0);
        await this.#close(transaction);
        return;
      }

      const registration = transaction.registration;
      const scrollNode = this.#options.getScrollNode();
      const spacerNode = this.#options.getSpacerNode();
      const rootNode = this.#options.hasFooter() ? this.#options.getRootNode() : null;
      const hasContent = scrollNode !== null && spacerNode !== null;

      if (rootNode === null) this.#applyFooterOffset(0);
      if (rootNode === null && (registration === null || !hasContent)) {
        await this.#close(transaction);
        return;
      }

      const [occlusion, root, viewport] = await Promise.all([
        this.#options.driver.resolveKeyboardOcclusion(transaction.keyboard),
        rootNode === null ? null : this.#options.driver.measure(rootNode),
        hasContent ? this.#options.driver.measure(scrollNode) : null,
      ]);
      if (!this.#isCurrent(transaction) || occlusion === null) return;

      // Root는 변형되지 않으므로 Root 아래쪽이 키보드에 가려진 높이만큼 Footer를 올린다.
      // 측정에 실패하면 현재 위치를 유지하고 다음 invalidation에서 다시 계산한다.
      if (root !== null) {
        this.#applyFooterOffset(Math.max(0, root.bottom - occlusion.topInScreenPx));
      }

      // 등록된 입력이 없어도 Footer를 올렸으면 Content 끝이 Footer에 가리지 않도록 spacer를 둔다.
      if (!hasContent || (registration === null && this.#appliedFooterOffset === 0)) {
        await this.#close(transaction);
        return;
      }
      if (viewport === null) return;

      await this.#open(
        transaction,
        registration,
        scrollNode,
        spacerNode,
        viewport,
        occlusion.topInScreenPx,
      );
    } catch {
      // Native 측정 실패는 현재 transaction만 중단하고 다음 invalidation에서 재시도한다.
    }
  }

  #applyFooterOffset(offset: number): void {
    if (!hasMeaningfulGeometryChange(this.#appliedFooterOffset, offset)) return;

    this.#options.setFooterOffset(offset);
    this.#appliedFooterOffset = offset;
  }

  async #close(transaction: Transaction<Node>): Promise<void> {
    if (this.#appliedSpacerHeight === 0 && !this.#needsCloseClamp) return;

    // 전환 중에는 적용한 높이와 화면의 높이가 달라 다시 재면 남은 spacer 전체를 전환하게 된다.
    // 정리 timer가 전환이 끝난 뒤 다시 평가한다.
    if (this.#cancelCloseCleanup !== null) return;

    const scrollNode = this.#options.getScrollNode();
    if (this.#appliedSpacerHeight !== 0) {
      const spacerNode = this.#options.getSpacerNode();
      if (spacerNode === null) return;

      const travel = scrollNode === null ? null : await this.#measureCloseTravel(scrollNode);
      if (!this.#isCurrent(transaction)) return;
      if (travel !== null) {
        await this.#collapseSpacer(transaction, spacerNode, travel);
        if (!this.#isCurrent(transaction)) return;
        // 전환 중이면 정리 timer가 다시 평가할 때 범위를 벗어난 offset을 확인한다.
        this.#needsCloseClamp = true;
        if (this.#cancelCloseCleanup !== null) return;
      } else {
        // 위치를 재지 못하면 spacer 전체를 전환하고 아래에서 범위를 벗어난 offset을 되돌린다.
        this.#options.driver.setSpacerHeight(spacerNode, 0, true);
        this.#appliedSpacerHeight = 0;
        this.#needsCloseClamp = true;
      }
    }
    if (scrollNode === null) return;

    await this.#options.driver.waitForLayout();
    if (!this.#isCurrent(transaction)) return;

    const viewport = await this.#options.driver.measure(scrollNode);
    if (!this.#isCurrent(transaction) || viewport === null) return;

    const viewportHeight = Math.max(0, viewport.bottom - viewport.top);
    const metrics = await this.#options.driver.getScrollMetrics(scrollNode, viewportHeight);
    if (!this.#isCurrent(transaction) || metrics === null) return;

    const clampedOffset = clampScrollOffset(metrics.offsetY, metrics.maxOffsetY);
    if (clampedOffset === metrics.offsetY) {
      this.#needsCloseClamp = false;
      return;
    }

    this.#options.driver.scrollTo(scrollNode, clampedOffset, this.#options.getSmooth());
    this.#needsCloseClamp = false;
  }

  /**
   * spacer가 줄어도 최대 offset이 현재 offset보다 작아질 때까지 Content는 움직이지 않고, offset이 0에 닿으면 멈춘다.
   * 곡선 전체가 Content 이동에 쓰이도록 화면 밖 spacer(`hidden`)와 Content가 내려갈 거리(`distance`)를 나눈다.
   */
  async #measureCloseTravel(
    scrollNode: Node,
  ): Promise<{ hidden: number; distance: number } | null> {
    const viewport = await this.#options.driver.measure(scrollNode);
    if (viewport === null) return null;

    const viewportHeight = Math.max(0, viewport.bottom - viewport.top);
    const metrics = await this.#options.driver.getScrollMetrics(scrollNode, viewportHeight);
    if (metrics === null) return null;

    const spacerHeight = this.#appliedSpacerHeight;
    const hidden = Math.min(spacerHeight, Math.max(0, metrics.maxOffsetY - metrics.offsetY));
    const distance = Math.min(Math.max(0, metrics.offsetY), spacerHeight - hidden);
    return { hidden, distance };
  }

  async #collapseSpacer(
    transaction: Transaction<Node>,
    spacerNode: Node,
    { hidden, distance }: { hidden: number; distance: number },
  ): Promise<void> {
    // Content가 움직이지 않으면 spacer는 보이지 않으므로 바로 없앤다.
    if (!hasMeaningfulGeometryChange(0, distance)) {
      this.#options.driver.setSpacerHeight(spacerNode, 0, false);
      this.#appliedSpacerHeight = 0;
      return;
    }

    // 화면 밖 spacer를 먼저 없애야 전환을 시작하자마자 Content가 내려간다.
    const start = this.#appliedSpacerHeight - hidden;
    if (hasMeaningfulGeometryChange(0, hidden)) {
      this.#options.driver.setSpacerHeight(spacerNode, start, false);
      this.#appliedSpacerHeight = start;
      await this.#options.driver.waitForLayout();
      if (!this.#isCurrent(transaction)) return;
    }

    const end = start - distance;
    this.#options.driver.setSpacerHeight(spacerNode, end, true);
    this.#appliedSpacerHeight = end;

    // 전환이 끝나면 다시 평가한다. Content가 맨 위에 닿은 뒤 남은 spacer는 보이지 않으므로 그때 없앤다.
    this.#cancelCloseCleanup = this.#options.scheduler.scheduleTimer(() => {
      this.#cancelCloseCleanup = null;
      this.#invalidate("layout");
    }, KEYBOARD_CLOSE_DURATION_MS);
  }

  async #open(
    transaction: Transaction<Node>,
    registration: KeyboardAvoidanceRegistration<Node> | null,
    scrollNode: Node,
    spacerNode: Node,
    viewport: VerticalRect,
    keyboardOcclusionTop: number,
  ): Promise<void> {
    // Footer는 Content 바로 아래에서 올라간 거리만큼 Content 아래쪽을 가린다.
    const footerOffset = this.#appliedFooterOffset;
    const safeArea = calculateSafeArea({
      viewport,
      keyboardOcclusionTop:
        footerOffset > 0 ? viewport.bottom - footerOffset : keyboardOcclusionTop,
      toolbarHeight: this.#options.getToolbarHeight(),
      keyboardGap: this.#options.getKeyboardGap(),
    });
    this.#needsCloseClamp = false;

    if (hasMeaningfulGeometryChange(this.#appliedSpacerHeight, safeArea.spacerHeight)) {
      // 바로 이어서 대상 위치를 재므로 키보드가 열린 동안에는 전환하지 않는다.
      this.#options.driver.setSpacerHeight(spacerNode, safeArea.spacerHeight, false);
      this.#appliedSpacerHeight = safeArea.spacerHeight;
    }

    // 등록된 입력이 없거나 Footer 안의 입력이면 Content를 스크롤하지 않는다.
    // spacer는 유지해 가려진 Content 끝까지 사용자가 스크롤할 수 있게 한다.
    if (registration === null || registration.placement === "footer") return;

    await this.#options.driver.waitForLayout();
    if (!this.#isCurrent(transaction)) return;

    const state = this.#getOwnerState(registration.owner, transaction.session);
    const measure = (ref: RefLike<Node> | undefined): Promise<VerticalRect | null> => {
      const node = ref?.current;
      if (node === null || node === undefined) return Promise.resolve(null);
      return Promise.resolve()
        .then(() => this.#options.driver.measure(node))
        .catch(() => null);
    };
    const [field, control, native, anchor] = await Promise.all([
      state.fieldDowngraded ? Promise.resolve(null) : measure(registration.fieldRef),
      measure(registration.controlRef),
      measure(registration.nativeRef),
      measure(registration.anchorRef),
    ]);
    if (!this.#isCurrent(transaction)) return;

    const fieldBody = createFieldBodyRect(field, control);
    const selected = selectLargestFittingTarget(
      { field, fieldBody, control, native, anchor },
      safeArea,
    );
    const nextState: OwnerSessionState = {
      ...state,
      fieldDowngraded:
        state.fieldDowngraded ||
        (fieldBody === null && field !== null && selected !== null && selected.kind !== "field"),
      lastTargetKind: selected?.kind ?? null,
      lastTargetHeight: selected ? targetHeight(selected.rect) : null,
    };

    if (selected === null) {
      this.#ownerStates.set(registration.owner, nextState);
      return;
    }

    if (
      transaction.layoutOnly &&
      ((state.lastTargetKind === selected.kind &&
        state.lastTargetHeight !== null &&
        targetHeight(selected.rect) < state.lastTargetHeight - 1) ||
        (state.lastTargetKind === "fieldBottom" && selected.kind !== "fieldBottom"))
    ) {
      this.#ownerStates.set(registration.owner, nextState);
      return;
    }

    const delta = calculateSignedScrollDelta(selected.rect, safeArea);
    if (delta === 0) {
      this.#ownerStates.set(registration.owner, nextState);
      return;
    }

    const viewportHeight = Math.max(0, viewport.bottom - viewport.top);
    const metrics = await this.#options.driver.getScrollMetrics(scrollNode, viewportHeight);
    if (!this.#isCurrent(transaction) || metrics === null) return;

    const nextOffset = clampScrollOffset(metrics.offsetY + delta, metrics.maxOffsetY);
    if (!hasMeaningfulGeometryChange(metrics.offsetY, nextOffset)) {
      this.#ownerStates.set(registration.owner, nextState);
      return;
    }

    this.#options.driver.scrollTo(scrollNode, nextOffset, this.#options.getSmooth());
    this.#ownerStates.set(registration.owner, nextState);
  }

  #getOwnerState(owner: object, session: number): OwnerSessionState {
    const current = this.#ownerStates.get(owner);
    if (current?.session === session) return current;

    return {
      session,
      fieldDowngraded: false,
      lastTargetKind: null,
      lastTargetHeight: null,
    };
  }
}

export function createKeyboardAvoidingEngine<Node>(
  options: KeyboardAvoidingEngineOptions<Node>,
): KeyboardAvoidingEngine<Node> {
  return new KeyboardAvoidingEngineImpl(options);
}
