# Auto-push after commit

This repo can **push to `origin` automatically after every `git commit`**.

## One-time setup

From the repository root:

```bash
chmod +x scripts/setup-git-hooks.sh
./scripts/setup-git-hooks.sh
```

That sets `core.hooksPath` to `.githooks` so Git runs the shared hooks in this repo.

## Behaviour

- After each **commit**, the `post-commit` hook runs **`git push -u origin HEAD`**.
- **Saves in the editor do not push** — only commits trigger a push.
- If push fails (offline, branch protection, etc.), your commit remains local; fix the issue and run `git push` manually.

### Optional: open Pages preview after `design/` commits

If **`PM_AGENT_AUTO_OPEN_PREVIEW=1`** and **`gh`** is installed, the hook starts **`scripts/open-latest-design-preview.sh`** in the background after a successful push that includes changes under **`design/`**. See [gh-pages-preview.md](gh-pages-preview.md) for **`PAGES_PUBLIC_ORIGIN`** / **`PM_AGENT_PAGES_ORIGIN`**.

## Disable

```bash
git config --unset core.hooksPath
```

## New clones

Run `./scripts/setup-git-hooks.sh` again after cloning (Git does not enable `core.hooksPath` automatically).
