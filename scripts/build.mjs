import { build } from "esbuild";
import { readFileSync, copyFileSync, mkdirSync } from "node:fs";

// 1. Manifest validity gate — fails the build before anything ships.
//    Required-field rules: https://www.figma.com/plugin-docs/manifest/
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const required = ["name", "id", "api", "main", "editorType"];
for (const key of required) {
  if (!manifest[key]) throw new Error(`manifest.json missing required field "${key}"`);
}
if (manifest.documentAccess !== "dynamic-page") {
  throw new Error('manifest.json must set documentAccess:"dynamic-page" (required for new plugins)');
}
if (
  !manifest.networkAccess ||
  !Array.isArray(manifest.networkAccess.allowedDomains) ||
  manifest.networkAccess.allowedDomains.length === 0
) {
  throw new Error("manifest.json networkAccess.allowedDomains must be a non-empty list");
}

// 2. Bundle the plugin main thread.
await build({
  entryPoints: ["src/code.ts"],
  bundle: true,
  outfile: manifest.main,
  platform: "browser",
  format: "iife",
  target: ["es2017"],
  legalComments: "none",
  logLevel: "info"
});

// 3. Emit lib as CJS so node --test can exercise the pure logic.
mkdirSync(".testbuild", { recursive: true });
await build({
  entryPoints: ["src/lib.ts"],
  bundle: true,
  outfile: ".testbuild/lib.cjs",
  platform: "neutral",
  format: "cjs",
  logLevel: "silent"
});

// 4. UI iframe file.
copyFileSync("src/ui.html", manifest.ui);

console.log(`build ok -> ${manifest.main} + ${manifest.ui}`);
