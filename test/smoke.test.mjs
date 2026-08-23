import { test } from "node:test";
import assert from "node:assert/strict";

// One plugin load; per-test state lives on the shared mock.
globalThis.__html__ = "<html><body>mock ui</body></html>"; // injected by Figma at runtime
const state = { notified: [], closed: 0, shown: 0 };
globalThis.figma = {
  showUI: () => {
    state.shown++;
  },
  notify: (msg) => state.notified.push(msg),
  closePlugin: () => {
    state.closed++;
  },
  currentPage: { selection: [] },
  ui: {}
};
await import("../code.js");

test("plugin registers a message handler and shows its UI", () => {
  assert.equal(state.shown, 1);
  assert.equal(typeof globalThis.figma.ui.onmessage, "function");
});

function run(selection, payload) {
  state.notified.length = 0;
  state.closed = 0;
  globalThis.figma.currentPage.selection = selection;
  globalThis.figma.ui.onmessage(payload);
}

test("normalize applies one target value to every auto-layout frame", () => {
  const a = { type: "FRAME", layoutMode: "VERTICAL", paddingLeft: 4, paddingRight: 12, paddingTop: 24, paddingBottom: 8, itemSpacing: 40 };
  const b = { type: "FRAME", layoutMode: "HORIZONTAL", paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, itemSpacing: 4 };
  const text = { type: "TEXT" };

  run([a, b, text], { type: "normalize", targetSpacing: 16 });

  for (const n of [a, b]) {
    assert.deepEqual(
      [n.paddingLeft, n.paddingRight, n.paddingTop, n.paddingBottom, n.itemSpacing],
      [16, 16, 16, 16, 16]
    );
  }
  assert.deepEqual(state.notified, ["Normalized 2 frames to 16px"]);
  assert.equal(state.closed, 1);
});

test("empty selection is reported and the plugin closes cleanly", () => {
  run([], { type: "normalize", targetSpacing: 16 });
  assert.deepEqual(state.notified, ["Select one or more auto-layout frames first"]);
  assert.equal(state.closed, 1);
});

test("garbage input is rejected before touching the canvas", () => {
  const node = { type: "FRAME", layoutMode: "VERTICAL", paddingLeft: 8, itemSpacing: 8 };
  run([node], { type: "normalize", targetSpacing: "lots" });
  assert.deepEqual(state.notified, ["Enter a number between 0 and 200"]);
  assert.equal(node.paddingLeft, 8);
});

test("selection with no auto-layout frames reports zero changes", () => {
  const node = { type: "RECTANGLE" };
  run([node], { type: "normalize", targetSpacing: 16 });
  assert.deepEqual(state.notified, ["No auto-layout frames in selection"]);
  assert.equal(state.closed, 1);
});
