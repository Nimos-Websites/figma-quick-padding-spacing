import { applyNormalization, clampSpacing } from "./lib";

interface UiMessage {
  type?: string;
  targetSpacing?: unknown;
}

figma.showUI(__html__, { width: 240, height: 148 });

figma.ui.onmessage = (msg: UiMessage) => {
  if (msg?.type !== "normalize") return;

  const target = clampSpacing(msg.targetSpacing);
  if (target === null) {
    figma.notify("Enter a number between 0 and 200");
    figma.closePlugin();
    return;
  }

  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify("Select one or more auto-layout frames first");
    figma.closePlugin();
    return;
  }

  let touched = 0;
  for (const node of nodes) {
    if (applyNormalization(node, target).changed) touched++;
  }

  if (touched === 0) {
    figma.notify("No auto-layout frames in selection");
  } else {
    figma.notify(`Normalized ${touched} frame${touched === 1 ? "" : "s"} to ${target}px`);
  }
  figma.closePlugin();
};
