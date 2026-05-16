# HRREC-82977 gap review — canonical publish path

**Canonical Storage HTML for the rolling Confluence gap table** is produced by:

[`generate_gap_review_page_82977.py`](generate_gap_review_page_82977.py)

- **Input:** [`gap_review_82977_evidence_2026-05-15.json`](gap_review_82977_evidence_2026-05-15.json) (frozen replay evidence).
- **Outputs:** `gap_review_82977_confluence_body.html`, optional `--compact` / `--write-chunks`.

Other scripts (for example `gen_gap_review_82977_confluence.py`) may emit different preambles or row shapes. If Confluence shows text that does not appear in the repo HTML, treat it as **manual page text** or a **non-canonical generator run**—reconcile by republishing from this script or from a live `/user-story-gap-review` skill run per [`.cursor/skills/user-story-gap-review/SKILL.md`](../../../.cursor/skills/user-story-gap-review/SKILL.md).
