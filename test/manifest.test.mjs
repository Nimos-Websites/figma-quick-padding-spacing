import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const manifest = JSON.parse(
  readFileSync(new URL("../manifest.json", import.meta.url), "utf8")
);

test("manifest carries every field the Figma docs mark required", () => {
  for (const key of ["name", "id", "api", "main", "editorType"]) {
    assert.ok(manifest[key], `missing "${key}"`);
  }
});

test("documentAccess is dynamic-page (required for all new plugins)", () => {
  assert.equal(manifest.documentAccess, "dynamic-page");
});

test("networkAccess declares no external domains", () => {
  assert.deepEqual(manifest.networkAccess.allowedDomains, ["none"]);
});

test("editorType targets figma design mode only", () => {
  assert.deepEqual(manifest.editorType, ["figma"]);
});

test("plugin id is a numeric string assigned by Figma", () => {
  assert.match(manifest.id, /^\d+$/);
});

test("declared main and ui files exist on disk after build", () => {
  assert.ok(existsSync(new URL("../" + manifest.main, import.meta.url)), manifest.main);
  assert.ok(existsSync(new URL("../" + manifest.ui, import.meta.url)), manifest.ui);
});
