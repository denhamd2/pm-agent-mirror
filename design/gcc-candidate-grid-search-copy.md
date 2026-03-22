# UX copy review: GCC candidate grid & search (MISSION-017)

**Prototype:** `design/gcc-candidate-grid-search.tsx`  
**Date:** 20 March 2026  
**Agent:** 319-doc-writer (GCC E2E)

## Summary

| Area | Issues | Notes |
|------|--------|--------|
| Buttons | 0 | Verb + noun pattern OK |
| Headings | 0 | Sentence case |
| AI / legal | 1 | See below |

## Findings

### AI disclosure (legal-sensitive — 060)

- **Current:** Banner and rail copy state suggestions are advisory, no auto-move, EU AI Act / GDPR human oversight.
- **Assessment:** Directionally correct for prototype; **legal** should validate final strings before GA.
- **Suggestion:** Replace "EU AI Act / GDPR" in user-visible banner with plainer language for recruiters, e.g. "Human review required — suggestions do not change candidate status." Keep detailed compliance note in admin or expandable help.

### Minor

- **"Boolean syntax"** — Clear; alternative **"Search syntax"** if boolean intimidates novices.

## Approved for prototype

Copy is acceptable for stakeholder demo; legal review on AI-facing strings before production.
