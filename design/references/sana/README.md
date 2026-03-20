# Sana Style UI reference

Version-controlled **high-fidelity reference** for **Sana**-aligned Workday UI: neutral white and light grey surfaces, grey top bar with white pill search, labelled primary icon rail, sparing blue accents, soft radii, and Canvas Kit–friendly typography hierarchy.

## Files

| File | Use |
|------|-----|
| `Sana_Style_UI-secondary-nav-grey.png` | **Secondary hub column**: same grey as icon rail; inactive tabs medium grey; active tab darker grey pill + bold black; person icon + hub title |
| `Sana_Style_UI-employee-profile-comm-dock.png` | Full shell + comm dock (grey top nav, white search pill, labelled icon rail) |
| `Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png` | Full shell: top nav, left tab bar, white cards on light grey canvas |
| `Sana_Style_UI-e0cea579-b804-4bf4-a662-30fc2a8cbe96.png` | Earlier benchmark; neutrals, radii, type hierarchy |

## How agents use this

- **`010-style-guide.mdc`**: Canonical written spec under **Sana Style UI**; these PNGs validate layout and density.
- **315** (discovery): Cite paths in **Visual shell & references** when the brief targets Sana fidelity; specify **`WorkdayLeftTabBar`** tab set.
- **320** (prototype): Compare running UI against these files; use shared **`WorkdayTopNav`**, **`WorkdayLeftTabBar`**, and **`design/components/sanaShellTheme.ts`**; prefer Canvas Kit tokens (`user-canvas-kit-mcp`) over pixel-matching.

## Path (repo root)

- `design/references/sana/Sana_Style_UI-secondary-nav-grey.png`
- `design/references/sana/Sana_Style_UI-employee-profile-comm-dock.png`
- `design/references/sana/Sana_Style_UI-e1cc54e6-0b94-46e8-88cf-9a0667164eb4.png`
- `design/references/sana/Sana_Style_UI-e0cea579-b804-4bf4-a662-30fc2a8cbe96.png`

When updating the reference image, add or replace the PNG and adjust this table if the filename changes.
