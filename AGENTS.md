# Maintenance instructions

These instructions apply to the whole repository. They are written for AI agents and human maintainers updating the explainer.

## Non-negotiable evidence rules

1. Read the complete supporting source before adding, changing or quoting a material claim. Check the relevant methods, tables or figures, limitations and publication status; an abstract, search snippet or secondary summary is not enough.
2. Do not bypass paywalls or access controls. If a required full text cannot be obtained legally, mark the source `MANUAL_RETRIEVAL` and stop the evidence-affecting edit.
3. Keep full texts outside the repository. Use a local path supplied through `AI_POLICY_SOURCE_ROOT`; never commit source files, local paths, cookies or credentials.
4. Record every material claim in `evidence/CLAIM_EVIDENCE_MATRIX.csv` with a stable claim ID, source ID, precise locator, access status, caveat and audit status.
5. Add or update the source in `evidence/source_registry.csv`. Confirm identity, version, current correction or retraction status, retrieval date, byte count and SHA-256 hash.
6. Distinguish measurement, provider disclosure, modelled estimate, scenario, forecast, legal requirement and editorial inference. Never present one as another.
7. Compare values only when the functional unit, system boundary, endpoint, time basis and relevant population match. Otherwise explain the difference without calculating an equivalence ratio.
8. Preserve uncertainty and missing evidence. Do not turn a range into a central estimate or convert `not checked` into implied support.

## Bilingual editing

- Update `site/index.html` and `site/cs.html` in the same change whenever evidence, values, citations, interactions or structure change.
- Preserve semantic and evidential parity, not literal sentence order. Czech must read as natural academic Czech.
- Use `evidence/TERMINOLOGY_CS.md` for established terminology. At first substantive use, include the English original when it helps identify a technical or legal term.
- Keep source identity, source order, citation anchors and interaction schema aligned across languages.

## Types of change

- **Presentation-only:** layout, accessibility or code changes that leave all factual content untouched. Full-text re-reading is not required, but bilingual and browser checks still are.
- **Evidence-affecting:** any new or changed fact, number, comparison, caveat, source or conclusion. Full-text verification and a human scientific review are required.
- **Evidence refresh:** recheck source status, links, newer authoritative evidence and dated policy or forecast statements. Update the review date only after the full refresh is complete.

## Required checks

Run from the repository root:

```bash
python3 qa/validate_public.py
npm install
npx playwright install chromium
python3 -m http.server 4173 --directory site
BASE_URL=http://127.0.0.1:4173/index.html npm run test:browser
```

The HTTP server stays running while the browser test executes. The browser report and screenshots are written to `qa-output/`, which is ignored by Git.

Before release, also inspect both languages on desktop and mobile, confirm external links, and review the diff for local paths or internal notes.

## Release boundary

- GitHub Pages publishes only `site/`.
- Automated checks establish technical consistency; they do not prove scientific validity or independent review.
- Do not deploy factual changes until a human maintainer has approved the evidence and both language versions.
- Do not describe this project as a systematic review, independent lifecycle assessment, accessibility certification or externally peer-reviewed work.
