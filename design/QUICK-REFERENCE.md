# Design Workflow Quick Reference

## 3 Ways to Call Agents

### Prototype-First (Primary Flow)
```
"Build a prototype from this spec"
"Implement this component"
```
→ 420-prototype-developer → 410-doc-writer → 430-ux-designer  
Build first, review copy, capture to Figma

### Design-First (When Figma Exists)
```
"Implement this Figma design: [URL]"
```
→ 430-ux-designer → 410-doc-writer → 420-prototype-developer  
Analyze Figma, review copy, implement with Canvas Kit

---

### 1. Use 420-prototype-developer (Standalone)
```
"Implement this component using Canvas Kit"
"Build [component name] with Canvas Kit"
"Create a prototype for [component]"
```
Production-ready Canvas Kit code, first in prototype-first flow

---

### 2. Use 410-doc-writer (Standalone)
```
"Review the copy in this design"
"Check if these button labels follow guidelines"
"Improve these error messages: [paste text]"
```
Copy review against Editorial Guidelines. Works with 420 (Prototype Developer).

---

### 3. Use 430-ux-designer (Standalone)
```
"What's in this Figma file: [URL]"
"Analyze this design: [URL]"
"Capture this prototype to Figma"
```
Design analysis, FigJam diagrams, or capture web prototype to Figma

---

## Quick Decision Tree

**Do you have a running prototype to capture?**
- Yes → Use 430 (capture to Figma)

**Do you have a Figma URL to analyze?**
- Yes → Use 430 (analyze) or design-first chain

**Do you need to build a prototype?**
- Yes → Use 420 (or prototype-first chain)

**Do you need to review UI copy?**
- Yes → Use 410

---

## Most Common Workflows

### "Build a prototype first"
```
"Build this component: [specs]"
```
→ 420 → 410 (copy) → 430 (capture to Figma)

### "Implement from Figma"
```
"Implement [Figma URL]"
```
→ 430 → 410 → 420 (design-first chain)

### "Just analyze a design"
```
"What's in [Figma URL]"
```
→ 430 only

### "Capture prototype to Figma"
```
"Capture our prototype to Figma. It's at localhost:5199"
```
→ 430 only

---

## Remember

- **420** = Prototype Developer (builds first)
- **410** = Doc Writer (copy review, works with 420)
- **430** = UX Designer (analyzes Figma, captures to Figma)
- Full guide at `/design/DESIGN-WORKFLOW-GUIDE.md`
