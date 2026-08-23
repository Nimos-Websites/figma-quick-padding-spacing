export const MIN_SPACING = 0;
export const MAX_SPACING = 200;

export interface NormalizableNode {
  readonly type?: string;
  readonly layoutMode?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
}

export interface NormalizeResult {
  changed: boolean;
  paddingChanged: boolean;
  spacingChanged: boolean;
}

export function clampSpacing(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  const rounded = Math.round(raw);
  if (rounded < MIN_SPACING) return MIN_SPACING;
  if (rounded > MAX_SPACING) return MAX_SPACING;
  return rounded;
}

/**
 * True only for auto-layout frames — the only nodes where Figma accepts
 * padding and itemSpacing writes. layoutMode is "NONE" or undefined on
 * plain frames, groups, text, shapes.
 */
export function isAutoLayoutContainer(node: NormalizableNode): boolean {
  return node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL";
}

/** Mutates the node in place (Figma nodes are live objects; never copy them). */
export function applyNormalization(node: NormalizableNode, target: number): NormalizeResult {
  const result: NormalizeResult = { changed: false, paddingChanged: false, spacingChanged: false };
  if (!isAutoLayoutContainer(node)) return result;

  node.paddingLeft = target;
  node.paddingRight = target;
  node.paddingTop = target;
  node.paddingBottom = target;
  node.itemSpacing = target;
  result.paddingChanged = true;
  result.spacingChanged = true;
  result.changed = true;
  return result;
}

export function countTouched(nodes: NormalizableNode[], target: number): number {
  let touched = 0;
  for (const node of nodes) {
    if (applyNormalization(node, target).changed) touched++;
  }
  return touched;
}
