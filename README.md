# Quick Padding & Spacing Normalizer

A Figma plugin that sets uniform auto-layout padding and item spacing on every selected frame in one click.

## The minute it saves

Before: select each frame, open the padding fields, type four numbers, then find item spacing and type a fifth.
After: select any number of frames, type one number, click **Normalize Selected**.

## What it does

For every node in the current selection:

- If it supports padding (auto-layout frames), sets `paddingLeft/Right/Top/Bottom` to your target value
- If it supports `itemSpacing`, sets it to the same value

Nothing else is touched. No network access (`networkAccess: none`). Runs entirely in your file.

## Install (run in Development mode)

1. Clone this repo:
   ```
   git clone https://github.com/dev55acc-ai/figma-quick-padding-spacing.git
   ```
2. In Figma: **Menu → Plugins → Development → Import plugin from manifest...**
3. Pick `manifest.json` from the cloned folder.

## Files

| File | Role |
| --- | --- |
| `manifest.json` | Plugin manifest (`main: code.js`, `ui: ui.html`) |
| `code.ts` | Source — selection loop + message handling |
| `code.js` | Compiled plugin code (what Figma runs) |
| `ui.html` | One number input, one button |

## Rebuild

```
npm install
npx tsc
```
