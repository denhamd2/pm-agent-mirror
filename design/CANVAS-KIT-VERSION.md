# Canvas Kit version (prototypes + MCP alignment)

**Target:** [Canvas Kit **14.2.37**](https://www.npmjs.com/package/@workday/canvas-kit-react) for `@workday/canvas-kit-react` and `@workday/canvas-kit-react-fonts` — matches **Workday Canvas** [v14.2.37](https://canvas.workdaydesign.com/help/announcements) on canvas.workdaydesign.com.

**Tokens CSS:** `@workday/canvas-tokens-web` **3.1.6** (imports in `main.tsx`: `css/base`, `css/system`, `css/brand` `_variables.css`). Workday also publishes **Canvas Tokens v4** guidance (brand refresh, semantic surfaces, migrations); see [Announcements](https://canvas.workdaydesign.com/help/announcements) before bumping the tokens package — plan migrations (e.g. `system.color.border.inverse` → `system.color.border.inverse.default` is a documented breaking change in v4).

**Cursor MCP:** `user-canvas-kit-mcp` metadata includes `canvasKitTargetVersion: 14.2.37` (see `mcps/user-canvas-kit-mcp/SERVER_METADATA.json` under the Cursor project). Use MCP tools for token names and migration snippets; cross-check behaviour and visuals against Workday’s own docs below.

## Official Workday Canvas context (v14)

Use these alongside **`get-canvas-kit-tokens`** / MCP resources:

- [**Canvas v14 upgrade guide**](https://canvas.workdaydesign.com/help/upgrade-guides/canvas-v14-upgrade-guide) — **Visual changes** tab: brand palette, default **Card** (no default shadow; border-led default; **`borderless`** / **`filled`** variants), input radius, **Count Badge** emphasis, **TertiaryButton** / link underline behaviour, **caution** vs legacy alert/warning naming, etc.
- Same guide — **For developers**: **FormField** + **`FormField.Field`** patterns, **`error="caution"`** (not `alert`), **CanvasProvider** / CSS variable cascading, optional **`npx @workday/canvas-kit-codemod v14 [path]`**, LLM migration file for assistants.
- [**Announcements**](https://canvas.workdaydesign.com/help/announcements) — release notes, **Canvas Tokens v4** summary, links to upgrade guides.

## Practical notes for this repo

- **FormField (v14):** composition API — `<FormField id="…"><FormField.Label/><FormField.Input as={TextInput}/></FormField>` (already applied in `design/*.tsx` where `FormField` is used).
- **Legacy JS tokens:** `@workday/canvas-kit-react/tokens` is deprecated in favour of **`@workday/canvas-tokens-web`**; new work should prefer CSS variables / migration paths from the docs above.
- **Avatar:** **Main** `Avatar` is deprecated; Preview **`@workday/canvas-kit-preview-react`** `Avatar` uses a **`name`** prop — migrate when touching avatars.
- **Embedded apps:** If the host already imports token CSS, avoid duplicate production imports (see Workday’s note in the upgrade guide).

**Verify:** `cd design && npm run build`
