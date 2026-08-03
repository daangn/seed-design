import {
  calculateSafeArea,
  calculateSignedScrollDelta,
  clampScrollOffset,
  hasMeaningfulGeometryChange,
  selectLargestFittingTarget,
  type AvoidanceTargetKind,
  type VerticalRect,
} from "./geometry";
import type { KeyboardOcclusion, RawKeyboardState, ScrollMetrics } from "./native-driver";

const BLUR_HANDOFF_DELAY_MS = 30;

export interface RefLike<Node> {
  current: Node | null;
}

export interface KeyboardAvoidanceRegistration<Node> {
  owner: object;
  nativeRef: RefLike<Node>;
  controlRef?: RefLike<Node>;
  fieldRef?: RefLike<Node>;
  anchorRef?: RefLike<Node>;
  enabled?: boolean;
}

export interface KeyboardAvoidingNativeDriver<Node> {
  measure(node: Node): Promise<VerticalRect | null>;
  resolveKeyboardOcclusion(state: RawKeyboardState): Promise<KeyboardOcclusion | null>;
  setSpacerHeight(node: Node, height: number): void;
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
  getScrollNode(): Node | null;
  getSpacerNode(): Node | null;
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
  #needsCloseClamp = false;
  #cancelFrame: CancelScheduledCallback | null = null;
  #cancelBlur: CancelScheduledCallback | null = null;
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
      if (!transaction.keyboard.visible || transaction.registration === null) {
        await this.#close(transaction);
        return;
      }

      await this.#open(transaction, transaction.registration);
    } catch {
      // Native 측정 실패는 현재 transaction만 중단하고 다음 invalidation에서 재시도한다.
    }
  }

  async #close(transaction: Transaction<Node>): Promise<void> {
    if (this.#appliedSpacerHeight === 0 && !this.#needsCloseClamp) return;

    const scrollNode = this.#options.getScrollNode();
    if (this.#appliedSpacerHeight !== 0) {
      const spacerNode = this.#options.getSpacerNode();
      if (spacerNode === null) return;

      this.#options.driver.setSpacerHeight(spacerNode, 0);
      this.#appliedSpacerHeight = 0;
      this.#needsCloseClamp = true;
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

  async #open(
    transaction: Transaction<Node>,
    registration: KeyboardAvoidanceRegistration<Node>,
  ): Promise<void> {
    const scrollNode = this.#options.getScrollNode();
    const spacerNode = this.#options.getSpacerNode();
    if (scrollNode === null || spacerNode === null) return;

    const [viewport, occlusion] = await Promise.all([
      this.#options.driver.measure(scrollNode),
      this.#options.driver.resolveKeyboardOcclusion(transaction.keyboard),
    ]);
    if (!this.#isCurrent(transaction) || viewport === null || occlusion === null) return;

    const safeArea = calculateSafeArea({
      viewport,
      keyboardOcclusionTop: occlusion.topInScreenPx,
      toolbarHeight: this.#options.getToolbarHeight(),
      keyboardGap: this.#options.getKeyboardGap(),
    });
    this.#needsCloseClamp = false;

    if (hasMeaningfulGeometryChange(this.#appliedSpacerHeight, safeArea.spacerHeight)) {
      this.#options.driver.setSpacerHeight(spacerNode, safeArea.spacerHeight);
      this.#appliedSpacerHeight = safeArea.spacerHeight;
    }

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

    const selected = selectLargestFittingTarget({ field, control, native, anchor }, safeArea);
    const nextState: OwnerSessionState = {
      ...state,
      fieldDowngraded:
        state.fieldDowngraded || (field !== null && selected !== null && selected.kind !== "field"),
      lastTargetKind: selected?.kind ?? null,
      lastTargetHeight: selected ? targetHeight(selected.rect) : null,
    };

    if (selected === null) {
      this.#ownerStates.set(registration.owner, nextState);
      return;
    }

    if (
      transaction.layoutOnly &&
      state.lastTargetKind === selected.kind &&
      state.lastTargetHeight !== null &&
      targetHeight(selected.rect) < state.lastTargetHeight - 1
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
