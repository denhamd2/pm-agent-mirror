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

## Disable

```bash
git config --unset core.hooksPath
```

## New clones

Run `./scripts/setup-git-hooks.sh` again after cloning (Git does not enable `core.hooksPath` automatically).
