# Update protocol

## 1. Define the change

Classify it as presentation-only, evidence-affecting or a full evidence refresh. List the affected sections, claims and language versions before editing.

## 2. Acquire and verify sources

For every evidence-affecting change, obtain the complete source legally and keep it outside Git. Confirm source identity, version, publication status, corrections or retractions, and readable access to the relevant text, table or figure.

Read the full source before drafting. Record its metadata and file hash in `evidence/source_registry.csv`; never record an absolute local path.

## 3. Update the evidence record

Add or revise rows in `evidence/CLAIM_EVIDENCE_MATRIX.csv`. Each material claim needs a source locator, access status, caveat and audit decision. Record calculations and prohibited comparisons in `evidence/DERIVATIONS.md`.

If the evidence is incomplete, label the claim accordingly or leave it out. Do not fill gaps by inference.

## 4. Edit both languages

Update the English and Czech pages together. Preserve claim strength, values, units, dates, caveats and citations. Czech phrasing may differ when this improves readability; use `evidence/TERMINOLOGY_CS.md` for specialist terms.

## 5. Validate

Run the structural and browser checks listed in `AGENTS.md`. Inspect desktop and mobile views, interactions, source links and reciprocal language navigation. Review the staged diff for full texts, local paths, credentials and process-facing notes.

## 6. Approve and publish

Evidence-affecting changes require human scientific and editorial approval. Publish only the `site/` directory, then verify the English and Czech production URLs.
