# Quick Padding & Spacing Normalizer

Figma plugin. One click: every selected auto-layout frame gets the same padding and gap.

**Before:** frames at 4/12/24px padding, gaps anywhere from 8 to 40.
**After:** select them, type one number, run — identical padding and gap on every frame.

## Install

**No clone needed:** download [quick-padding-spacing-v1.0.0.zip](https://github.com/dev55acc-ai/figma-quick-padding-spacing/releases/download/v1.0.0/quick-padding-spacing-v1.0.0.zip), unzip it.

1. Figma (desktop app) → Plugins → Development → *Import plugin from manifest…* → pick `manifest.json` from the unzipped folder.
2. Select auto-layout frames, run the plugin, enter the target px value.

Prefer git? `git clone` this repo and do the same import step.

## Verify locally

```
npm ci
npm run typecheck   # compiles against @figma/plugin-typings
npm test            # builds code.js, validates manifest, unit + smoke tests
```

The smoke tests load the built `code.js` with a mocked `figma` global and assert
the real message flow: selection read, mutation applied, notify, closePlugin.

## Files that ship to Figma

- `manifest.json` — `documentAccess: "dynamic-page"`, no network access
- `code.js` — bundled from `src/` by esbuild (`npm run build`)
- `ui.html`

## Status

Free plugin (v1.0.0). Screenshots/GIF of it running inside Figma will be captured
from a real session once the Figma account exists — none are faked here.
