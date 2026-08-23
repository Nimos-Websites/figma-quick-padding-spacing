"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/lib.ts
  function clampSpacing(raw) {
    if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
    const rounded = Math.round(raw);
    if (rounded < MIN_SPACING) return MIN_SPACING;
    if (rounded > MAX_SPACING) return MAX_SPACING;
    return rounded;
  }
  function isAutoLayoutContainer(node) {
    return node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL";
  }
  function applyNormalization(node, target) {
    const result = { changed: false, paddingChanged: false, spacingChanged: false };
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
  var MIN_SPACING, MAX_SPACING;
  var init_lib = __esm({
    "src/lib.ts"() {
      "use strict";
      MIN_SPACING = 0;
      MAX_SPACING = 200;
    }
  });

  // src/code.ts
  var require_code = __commonJS({
    "src/code.ts"() {
      init_lib();
      figma.showUI(__html__, { width: 240, height: 148 });
      figma.ui.onmessage = (msg) => {
        if ((msg == null ? void 0 : msg.type) !== "normalize") return;
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
    }
  });
  require_code();
})();
