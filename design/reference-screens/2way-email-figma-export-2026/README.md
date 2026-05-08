# 2-Way Email — Figma export index (2026)

This folder is reserved for **new Figma PNG exports** copied from the Cursor project `assets/` or manual exports, aligned to the journey buckets in [`../../2-way-email-prototype-flow.md`](../../2-way-email-prototype-flow.md).

## Current repo snapshots

Authoritative committed references remain under [`../2way-email-refs/`](../2way-email-refs/) (Overview, Compose, Empty State PNGs). When additional exports land here, extend the table below.

## Filename → flow stage (template)

| Filename pattern (examples) | Flow stage |
|----------------------------|------------|
| `Overview-*`, shell/header frames | Profile shell |
| `Overview-1-*`, onboarding popover | First-run **Introducing Conversational Email** |
| `Overview-2*`, `Threads_-_Linear` | Mail dock — list-first (narrow sheet) |
| `Overview-3*` … `Overview-15*`, expanded inbound | Mail dock — split read (~35% / ~65%) |
| `Compose-*` | Compose wide sheet |
| `Error_*` | Compose validation |
| `Discard-*` | Discard confirm |
| `Empty_State_*` | Empty states |
| `Action_Bar-*` | Decision / action bar |

## Prototype control presets

Use **`#2-way-email-prototype?proto=1`** so the **Prototype controls** launcher appears outside dev (bottom-left; expand for the full panel). Hash params include **`panel=0|1`** for dock open/closed — see [`../2-way-email-prototype-visual-review.md`](../2-way-email-prototype-visual-review.md).
