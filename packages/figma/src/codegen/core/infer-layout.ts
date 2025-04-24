import type {
  NormalizedHasChildrenTrait,
  NormalizedHasFramePropertiesTrait,
  NormalizedHasLayoutTrait,
  NormalizedIsLayerTrait,
} from "@/normalizer";

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutProperties {
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode?: "FIXED" | "AUTO";
  counterAxisSizingMode?: "FIXED" | "AUTO";
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX"; // 'BASELINE' requires more info
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
}

interface InferResult {
  properties: LayoutProperties;
  childProperties: {
    [childId: string]: {
      layoutAlign?: "MIN" | "STRETCH";
    };
  };
}

type LayoutNode = NormalizedIsLayerTrait &
  NormalizedHasFramePropertiesTrait &
  NormalizedHasChildrenTrait &
  NormalizedHasLayoutTrait;

// --- Helper Functions ---

function getCollectiveBoundingBox(nodes: LayoutNode[]): BoundingBox | null {
  if (nodes.length === 0) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  nodes.forEach((node) => {
    const box = node.absoluteBoundingBox!;
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function calculateMean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function calculateVariance(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = calculateMean(arr);
  return arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length;
}

function calculateMedian(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sortedArr = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sortedArr.length / 2);
  if (sortedArr.length % 2 === 0) {
    return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
  }
  return sortedArr[mid];
}

// Tolerance for floating point comparisons and alignment checks
const EPSILON = 1; // 1 pixel tolerance

// --- Main Inference Function ---

export function inferLayout(parentNode: LayoutNode): InferResult {
  if (parentNode.layoutMode !== "NONE") {
    return {
      properties: {},
      childProperties: {},
    };
  }

  const children = (parentNode.children || []) as LayoutNode[];
  const parentBox = parentNode.absoluteBoundingBox!;
  const result: LayoutProperties = { layoutMode: "NONE" };

  if (children.length === 0) {
    return {
      properties: result,
      childProperties: {},
    }; // Cannot infer layout for no children
  }

  if (children.length === 1) {
    // Default for single child: Horizontal, Hug contents, No spacing, Calculate padding
    result.layoutMode = "HORIZONTAL";
    result.primaryAxisSizingMode = "AUTO";
    result.counterAxisSizingMode = "AUTO";
    result.itemSpacing = 0;
    result.primaryAxisAlignItems = "MIN"; // Doesn't matter for one item
    result.counterAxisAlignItems = "MIN"; // Doesn't matter for one item

    const childBox = children[0].absoluteBoundingBox!;
    result.paddingLeft = Math.max(0, childBox.x - parentBox.x);
    result.paddingRight = Math.max(
      0,
      parentBox.x + parentBox.width - (childBox.x + childBox.width),
    );
    result.paddingTop = Math.max(0, childBox.y - parentBox.y);
    result.paddingBottom = Math.max(
      0,
      parentBox.y + parentBox.height - (childBox.y + childBox.height),
    );
    return {
      properties: result,
      childProperties: {},
    };
  }

  // --- 1. Determine Layout Direction ---
  const sortedByX = [...children].sort(
    (a, b) => a.absoluteBoundingBox!.x - b.absoluteBoundingBox!.x,
  );
  const sortedByY = [...children].sort(
    (a, b) => a.absoluteBoundingBox!.y - b.absoluteBoundingBox!.y,
  );

  const horizontalGaps: number[] = [];
  for (let i = 0; i < sortedByX.length - 1; i++) {
    const current = sortedByX[i].absoluteBoundingBox!;
    const next = sortedByX[i + 1].absoluteBoundingBox!;
    // Ensure items don't significantly overlap vertically for horizontal check
    if (Math.max(current.y, next.y) < Math.min(current.y + current.height, next.y + next.height)) {
      horizontalGaps.push(next.x - (current.x + current.width));
    }
  }

  const verticalGaps: number[] = [];
  for (let i = 0; i < sortedByY.length - 1; i++) {
    const current = sortedByY[i].absoluteBoundingBox!;
    const next = sortedByY[i + 1].absoluteBoundingBox!;
    // Ensure items don't significantly overlap horizontally for vertical check
    if (Math.max(current.x, next.x) < Math.min(current.x + current.width, next.x + next.width)) {
      verticalGaps.push(next.y - (current.y + current.height));
    }
  }

  // Heuristic: Prefer axis with more non-negative gaps and lower variance
  const hVariance = calculateVariance(horizontalGaps.filter((g) => g >= -EPSILON));
  const vVariance = calculateVariance(verticalGaps.filter((g) => g >= -EPSILON));
  const hCount = horizontalGaps.filter((g) => g >= -EPSILON).length;
  const vCount = verticalGaps.filter((g) => g >= -EPSILON).length;

  let primaryAxisSortedNodes = sortedByX; // Default guess

  // Basic variance check (lower is better). Add slight bias for horizontal if equal.
  if (
    vCount > 0 &&
    (hCount === 0 ||
      (vVariance < hVariance - EPSILON && vCount >= hCount) ||
      (vVariance <= hVariance && vCount > hCount))
  ) {
    result.layoutMode = "VERTICAL";
    primaryAxisSortedNodes = sortedByY;
  } else if (hCount > 0) {
    result.layoutMode = "HORIZONTAL";
    primaryAxisSortedNodes = sortedByX;
  } else {
    // Ambiguous case based on gaps, fall back to bounding box aspect ratio
    const collectiveBox = getCollectiveBoundingBox(children);
    if (collectiveBox) {
      if (collectiveBox.height > collectiveBox.width) {
        result.layoutMode = "VERTICAL";
        primaryAxisSortedNodes = sortedByY;
      } else {
        result.layoutMode = "HORIZONTAL";
        primaryAxisSortedNodes = sortedByX;
      }
    } else {
      // Still nothing? Default to Horizontal
      result.layoutMode = "HORIZONTAL";
      primaryAxisSortedNodes = sortedByX;
    }
  }

  const primaryGaps = result.layoutMode === "HORIZONTAL" ? horizontalGaps : verticalGaps;
  const validGaps = primaryGaps.filter((g) => g >= -EPSILON); // Allow slight overlap

  // --- 2. Calculate Spacing & Primary Alignment ---
  let isSpaceBetween = false;
  const collectiveBox = getCollectiveBoundingBox(children);

  if (collectiveBox && children.length >= 2) {
    // Check for Space Between potential
    const first = primaryAxisSortedNodes[0].absoluteBoundingBox!;
    const last = primaryAxisSortedNodes[primaryAxisSortedNodes.length - 1].absoluteBoundingBox!;
    let firstStart: number;
    let lastEnd: number;
    let parentSize: number;

    if (result.layoutMode === "HORIZONTAL") {
      firstStart = first.x;
      lastEnd = last.x + last.width;
      parentSize = parentBox.width;
    } else {
      firstStart = first.y;
      lastEnd = last.y + last.height;
      parentSize = parentBox.height;
    }

    const contentSpan = lastEnd - firstStart;

    // Heuristic for Space Between: Content spans most of the parent & average gap is large
    const averageGap = calculateMean(validGaps);
    // Example threshold: Content fills > 85% AND average gap is > 20% of average item size? Or just large?
    if (contentSpan > parentSize * 0.8 && validGaps.length > 0 && averageGap > 10) {
      // Additional check: are first/last items close to parent edges (considering padding)?
      const startPadding =
        result.layoutMode === "HORIZONTAL" ? first.x - parentBox.x : first.y - parentBox.y;
      const endPadding =
        result.layoutMode === "HORIZONTAL"
          ? parentBox.x + parentBox.width - (last.x + last.width)
          : parentBox.y + parentBox.height - (last.y + last.height);

      // If start/end items are reasonably close to edges (e.g., < 2 * average gap?)
      if (
        Math.abs(startPadding) < Math.max(20, averageGap * 1.5) &&
        Math.abs(endPadding) < Math.max(20, averageGap * 1.5)
      ) {
        isSpaceBetween = true;
      }
    }
  }

  if (isSpaceBetween) {
    result.primaryAxisAlignItems = "SPACE_BETWEEN";
    result.itemSpacing = 0; // Spacing is implicit
    result.primaryAxisSizingMode = "FIXED"; // Usually fixed when using space between
  } else {
    result.primaryAxisAlignItems = "MIN"; // Default to MIN for packed, could refine later
    if (validGaps.length > 0) {
      // Use median spacing for robustness against outliers
      result.itemSpacing = calculateMedian(validGaps);
      // Clamp negative spacing if it's very small (likely float error)
      if (result.itemSpacing < 0 && result.itemSpacing > -EPSILON) {
        result.itemSpacing = 0;
      }
    } else {
      result.itemSpacing = 0; // No valid gaps found
    }
    result.primaryAxisSizingMode = "AUTO"; // Default to hug content for packed
  }

  // --- 3. Calculate Padding ---
  if (collectiveBox) {
    result.paddingLeft = Math.max(0, collectiveBox.x - parentBox.x);
    result.paddingRight = Math.max(
      0,
      parentBox.x + parentBox.width - (collectiveBox.x + collectiveBox.width),
    );
    result.paddingTop = Math.max(0, collectiveBox.y - parentBox.y);
    result.paddingBottom = Math.max(
      0,
      parentBox.y + parentBox.height - (collectiveBox.y + collectiveBox.height),
    );
  } else {
    result.paddingLeft = 0;
    result.paddingRight = 0;
    result.paddingTop = 0;
    result.paddingBottom = 0;
  }

  // --- 4. Determine Counter Axis Alignment ---
  const counterCoordsMin: number[] = [];
  const counterCoordsCenter: number[] = [];
  const counterCoordsMax: number[] = [];

  if (result.layoutMode === "HORIZONTAL") {
    // Check vertical alignment (Y)
    children.forEach((node) => {
      const box = node.absoluteBoundingBox!;
      counterCoordsMin.push(box.y);
      counterCoordsCenter.push(box.y + box.height / 2);
      counterCoordsMax.push(box.y + box.height);
    });
  } else {
    // VERTICAL layout
    // Check horizontal alignment (X)
    children.forEach((node) => {
      const box = node.absoluteBoundingBox!;
      counterCoordsMin.push(box.x);
      counterCoordsCenter.push(box.x + box.width / 2);
      counterCoordsMax.push(box.x + box.width);
    });
  }

  const minVariance = calculateVariance(counterCoordsMin);
  const centerVariance = calculateVariance(counterCoordsCenter);
  const maxVariance = calculateVariance(counterCoordsMax);

  const alignmentTolerance = EPSILON * EPSILON * 4; // Allow slightly more variance for alignment match
  if (
    minVariance <= centerVariance &&
    minVariance <= maxVariance &&
    minVariance < alignmentTolerance
  ) {
    result.counterAxisAlignItems = "MIN";
  } else if (
    centerVariance <= minVariance &&
    centerVariance <= maxVariance &&
    centerVariance < alignmentTolerance
  ) {
    result.counterAxisAlignItems = "CENTER";
  } else if (
    maxVariance <= minVariance &&
    maxVariance <= centerVariance &&
    maxVariance < alignmentTolerance
  ) {
    result.counterAxisAlignItems = "MAX";
  } else {
    // Default if variances are high or similar
    result.counterAxisAlignItems = "CENTER";
  }

  // --- 5. Determine Counter Axis Sizing Mode ---
  // Default to AUTO unless children perfectly fill the parent counter dimension
  result.counterAxisSizingMode = "AUTO";
  if (collectiveBox) {
    let collectiveCounterSize: number;
    let parentCounterSize: number;
    if (result.layoutMode === "HORIZONTAL") {
      collectiveCounterSize = collectiveBox.height;
      parentCounterSize = parentBox.height - (result.paddingTop ?? 0) - (result.paddingBottom ?? 0);
    } else {
      collectiveCounterSize = collectiveBox.width;
      parentCounterSize = parentBox.width - (result.paddingLeft ?? 0) - (result.paddingRight ?? 0);
    }
    // If collective size is very close to parent size on counter axis
    if (Math.abs(collectiveCounterSize - parentCounterSize) < EPSILON) {
      result.counterAxisSizingMode = "FIXED";
    }
  }

  // 6. Infer layoutAlign for each child
  const childProperties: InferResult["childProperties"] = {};
  const availableWidth = parentBox.width - (result.paddingLeft ?? 0) - (result.paddingRight ?? 0);
  const availableHeight = parentBox.height - (result.paddingTop ?? 0) - (result.paddingBottom ?? 0);

  children.forEach((child) => {
    const childBox = child.absoluteBoundingBox!;
    let inferredChildAlign: "INHERIT" | "STRETCH" | undefined = undefined;

    // Check STRETCH
    if (result.layoutMode === "HORIZONTAL") {
      // Counter: Vertical
      if (Math.abs(childBox.height - availableHeight) < EPSILON && availableHeight > 0) {
        inferredChildAlign = "STRETCH";
      }
    } else {
      // Counter: Horizontal
      if (Math.abs(childBox.width - availableWidth) < EPSILON && availableWidth > 0) {
        inferredChildAlign = "STRETCH";
      }
    }

    if (inferredChildAlign) {
      childProperties[child.id] = { layoutAlign: inferredChildAlign };
    }
  });

  return {
    properties: result,
    childProperties,
  };
}

export function applyInferredLayout<T extends LayoutNode>(parentNode: T, result: InferResult): T {
  const { properties, childProperties } = result;

  if (properties.layoutMode === "NONE") {
    return parentNode;
  }

  return {
    ...parentNode,
    ...properties,
    children: parentNode.children.map((child) => {
      const props = childProperties[child.id];
      if (props) {
        return { ...child, ...props };
      }
      return child;
    }),
  };
}
