import { test } from "node:test";
import assert from "node:assert/strict";
import pkg from "../.testbuild/lib.cjs";
const { applyNormalization, clampSpacing, countTouched, isAutoLayoutContainer } = pkg;

function frame(props = {}) {
  return {
    type: "FRAME",
    layoutMode: "VERTICAL",
    paddingLeft: 4,
    paddingRight: 12,
    paddingTop: 24,
    paddingBottom: 8,
    itemSpacing: 40,
    ...props
  };
}

test("clampSpacing rejects non-numeric input", () => {
  assert.equal(clampSpacing("16"), null);
  assert.equal(clampSpacing(NaN), null);
  assert.equal(clampSpacing(undefined), null);
  assert.equal(clampSpacing(Infinity), null);
});

test("clampSpacing rounds and clamps into [0, 200]", () => {
  assert.equal(clampSpacing(15.6), 16);
  assert.equal(clampSpacing(-5), 0);
  assert.equal(clampSpacing(9999), 200);
  assert.equal(clampSpacing(0), 0);
});

test("auto-layout detection matches only HORIZONTAL/VERTICAL", () => {
  assert.ok(isAutoLayoutContainer(frame()));
  assert.ok(isAutoLayoutContainer(frame({ layoutMode: "HORIZONTAL" })));
  assert.equal(isAutoLayoutContainer(frame({ layoutMode: "NONE" })), false);
  assert.equal(isAutoLayoutContainer({ type: "TEXT" }), false);
});

test("applyNormalization mutates the live node in place", () => {
  const node = frame();
  const result = applyNormalization(node, 16);
  assert.deepEqual(
    [node.paddingLeft, node.paddingRight, node.paddingTop, node.paddingBottom, node.itemSpacing],
    [16, 16, 16, 16, 16]
  );
  assert.deepEqual(result, { changed: true, paddingChanged: true, spacingChanged: true });
});

test("plain frames and non-containers are left untouched", () => {
  const plain = { type: "RECTANGLE" };
  const noneFrame = frame({ layoutMode: "NONE" });
  assert.equal(applyNormalization(plain, 16).changed, false);
  assert.equal(applyNormalization(noneFrame, 16).changed, false);
});

test("countTouched counts only auto-layout frames", () => {
  const nodes = [frame(), frame({ layoutMode: "NONE" }), { type: "TEXT" }, frame()];
  assert.equal(countTouched(nodes, 12), 2);
});
