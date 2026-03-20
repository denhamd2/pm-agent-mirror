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

## Open the preview in your browser (local)

GitHub Actions **cannot** open a browser on your Mac. This repo includes **`scripts/open-latest-design-preview.sh`**, which:

1. Finds the workflow run for your current **`HEAD`** commit.
2. Waits for it to finish.
3. Downloads the **`preview-open`** artifact (`preview.env`).
4. Runs **`scripts/open-url-chrome-and-cursor-browser.sh`**: **Google Chrome** (new window) and **Cursor Simple Browser** via the `vscode://vscode/simple-browser/show?...` deeplink (same as VS Code’s Simple Browser).

**Requirements:** [GitHub CLI](https://cli.github.com/) installed and `gh auth login` against your GHE host.

**Chrome only:** `OPEN_IN_CURSOR_BROWSER=0 ./scripts/open-latest-design-preview.sh`

**Local `npm run dev`:** also opens Chrome + Cursor Simple Browser; disable with `VITE_NO_OPEN_BROWSERS=1 npm run dev` (see `design/README.md`).

**Full URL in the artifact:** set a repository **Actions variable**:

| Name | Example value |
|------|----------------|
| `PAGES_PUBLIC_ORIGIN` | `https://ghe.megaleo.com` or `https://<user>.github.io` (scheme + host only, **no** path) |

The script combines **`PAGES_PUBLIC_ORIGIN` + `PREVIEW_PATH`** (same path Vite used for `base`). If `PAGES_PUBLIC_ORIGIN` is unset, export locally before running:

```bash
export PM_AGENT_PAGES_ORIGIN=https://ghe.megaleo.com
./scripts/open-latest-design-preview.sh
```

### Automatic open after each design commit (optional)

After a successful push, the **post-commit** hook can start the script in the background when **`design/`** changed:

```bash
export PM_AGENT_AUTO_OPEN_PREVIEW=1
# If PAGES_PUBLIC_ORIGIN is not set on the repo:
export PM_AGENT_PAGES_ORIGIN=https://ghe.megaleo.com
```

Add those lines to your shell profile, or prefix a one-off commit:

```bash
PM_AGENT_AUTO_OPEN_PREVIEW=1 PM_AGENT_PAGES_ORIGIN=https://ghe.megaleo.com git commit -am "…"
```

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
