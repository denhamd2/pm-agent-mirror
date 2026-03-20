# Design prototype previews (GitHub / GHE Pages)

Each successful run of **Deploy design prototype preview** (`.github/workflows/deploy-design-preview.yml`) builds `design/` with Vite and adds a **new folder** on the **`gh-pages`** branch:

```text
preview/preview-<UTC_YYYYMMDD-HHMMSS>-<run_id>/
```

Example: `preview/preview-20260320-153045-12345678/`

Older previews are kept (`clean: false`) so you can share links to past builds.

## One-time repository setup

1. **Enable GitHub Actions** on the repo (your org may restrict third-party actions; **JamesIves/github-pages-deploy-action** must be allowed).

2. **GitHub Pages**
   - **Settings → Pages**
   - **Source:** Deploy from a branch  
   - **Branch:** `gh-pages` / **/(root)**  
   - Save.

3. After the first workflow run, the `gh-pages` branch will exist. If Pages was set before the first run, wait for the workflow to finish, then open your site.

## Preview URL

The exact origin depends on your host.

### github.com (user or org Pages)

If the site is served at `https://<owner>.github.io/<repo>/`, you **do not** need `VITE_PAGES_BASE`. The workflow sets:

```text
VITE_BASE_PATH=/<repo>/preview/<slug>/
```

Full URL:

```text
https://<owner>.github.io/<repo>/preview/<slug>/
```

### GitHub Enterprise (GHE)

Pages URLs are often under a path such as `/pages/<owner>/<repo>/`. Set a repository **variable** (Settings → Secrets and variables → Actions → Variables):

| Name | Example value |
|------|-----------------|
| `VITE_PAGES_BASE` | `pages/david-denham/pm-agent` (no leading/trailing slash) |

The workflow then builds with:

```text
VITE_BASE_PATH=/pages/david-denham/pm-agent/preview/<slug>/
```

Match this to whatever path your instance uses for Pages (check **Settings → Pages** after enabling).

## Local build with a subpath (smoke test)

```bash
cd design
VITE_BASE_PATH=/pm-agent/preview/local-test/ npm run build
npx vite preview --base /pm-agent/preview/local-test/
```

## Figma capture

Figma html-to-design expects **`http://localhost:5199/`** with a fixed port. **Published previews** use a different base path; use **local `npm run dev`** for MCP capture unless you regenerate a capture URL for the hosted path.

## Trimming old previews

The `gh-pages` branch grows over time. You can delete old folders under `preview/` on that branch, or periodically reset `gh-pages` if you only need the latest build.
