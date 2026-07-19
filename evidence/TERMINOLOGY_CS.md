# Czech terminology and bilingual parity map

Purpose: keep the Czech public page idiomatic while preserving the meaning, evidence strength, values, citations and interaction structure of the validated English page.

## Editorial register

- Audience: academic and informed public readers.
- Czech should be natural, precise and readable aloud; it should not mirror English word order.
- Established English technical terms may remain where they are normal in Czech AI practice. Explain them on first substantive use when needed.
- Use Czech quotation marks `„…“`, decimal commas in Czech prose and non-breaking/typographic spacing where practical.
- Keep source titles in their published language.

## Stable terminology

| English concept | Czech rendering | Note |
|---|---|---|
| AI footprint | environmentální stopa AI / stopa AI | Use the shorter form after first context. |
| prompt | vstupní zadání (prompt); dále prompt | Explain at the first substantive occurrence; distinguish the input from the model response. |
| request | požadavek | Use for a service request, not as automatic variation for `prompt`. |
| response | odpověď | Model output. |
| task | úloha | Includes conversation, problem solving, image/video generation. |
| reasoning | usuzování (reasoning) | Use only for the capability or an explicitly enabled mode. Do not use it as a loose label for every difficult task. |
| problem-solving task | řešení problémů | In the ML.ENERGY comparison, preserve the source label `Problem Solving` and separately state that reasoning was on. |
| agentic work | úloha prováděná AI agentem / AI agent využívající několik nástrojů | Prefer a concrete description over `agentní workflow`; avoid `agentická práce`. |
| data centre | datové centrum | Plural `datová centra`. |
| inference | provoz nebo používání modelu (inference) | Explain at first occurrence; keep the technical distinction from training. |
| serving stack | systém pro inferenci a obsluhu požadavků | Avoid an unexplained literal stack where possible. |
| production measurement | měření v produkčním provozu | Provider's live service. |
| controlled benchmark | kontrolovaný srovnávací test (benchmark); dále benchmark | Czech explanation first; do not imply a whole public service was measured. |
| modelled estimate | modelový odhad | Do not imply measurement. |
| provider-authored | zpracovaný poskytovatelem | Keep independence limitation visible. |
| preprint | nerecenzovaný rukopis (preprint); dále preprint | Describe the review status, not merely the publication platform. |
| lifecycle assessment (LCA) | posouzení životního cyklu (LCA) | Keep `LCA` after first expansion. |
| functional unit | funkční jednotka | LCA term; keep distinct from a loosely described prompt. |
| system boundary | hranice systému | Use in the ITU/LCA context; `hranice započítání` remains the reader-facing measurement term. |
| sector outlook | sektorový výhled | Forecast/scenario, not measurement. |
| digital content consumption | používání digitálních služeb / spotřeba digitálního obsahu | Prefer the first form in reader-facing prose; use the second only when referring directly to the study's concept or title. |
| user archetype | modelový profil uživatele | In a technical methods discussion, introduce `uživatelský archetyp (user archetype)` once; the public page uses the clearer model-profile wording. |
| video streaming | streamování videa | Established Czech usage; keep the date, device and network boundary attached to any estimate. |
| equivalence claim | tvrzení o ekvivalenci / přímé přirovnání | In reader-facing prose prefer a concrete warning that the activities cannot be put on one scale. |
| accounting boundary | hranice započítání | Use `hranice` where context is already clear. |
| water withdrawal | odběr vody | Distinct from consumption. |
| water consumption | spotřeba vody | Distinct from withdrawal. |
| location-based emissions | emise podle metody založené na lokalitě (location-based) | Follows official Czech ESRS wording and explains the physical-location perspective. |
| market-based emissions | emise podle metody založené na trhu (market-based) | Follows official Czech ESRS wording and keeps contractual procurement distinct from physical supply. |
| water Scope 1/2/3 | přímý provoz / výroba elektřiny / dodavatelský řetězec (Scope 1/2/3) | Keep the source's English category labels but lead with their concrete meaning. |
| embodied impacts | dopady spojené s výrobou hardwaru | Prefer concrete meaning over `vtělené dopady`. |
| material footprint / material demand | materiálová stopa / materiálová náročnost | Do not reduce this to e-waste; it includes upstream extraction and equipment lifetime. |
| hardware lifetime consumed | podíl vyčerpané životnosti hardwaru | Explain in prose; avoid a literal English noun chain. |
| e-waste | elektroodpad | One word. |
| supply chain | dodavatelský řetězec | Stable across the page. |
| grid | elektrizační soustava / síť | Use `síť` only when unambiguous. |
| watershed stress | zatížení místních vodních zdrojů | Avoid a literal hydrological calque in general prose. |
| land use / land footprint | využití půdy / půdní stopa / zábor půdy | Choose by context: indicator, footprint or concrete local burden. |
| distributional impact | rozložení dopadů / distribuční otázka | Means who and which region carries the burden, not a statistical distribution alone. |
| rating scheme | systém hodnocení | The 2026 Commission roadmap is a timetable, not an operative public label. |
| general-purpose AI model (GPAI) | obecný model AI (GPAI) | Preserve the exact Czech legal category used by the AI Act; add the established English acronym. |
| key performance indicator (KPI) | klíčový ukazatel výkonnosti (KPI) | Expand at first occurrence. |
| token | token; at first use explain as a text unit of the model | The unit is model-specific and does not equal a word. |
| marginal impact | dodatečný dopad (marginal impact) | Prefer the reader-facing meaning over the ambiguous calque `mezní dopad`. |
| bottom-up model | model sestavený zdola nahoru (bottom-up) | Keep the English term at the first methodological occurrence. |

## Source-backed terminology decisions

Terminology was rechecked on 19 July 2026 against the following Czech institutional, academic and legal sources and against the primary study whose task labels are being translated:

- **Reasoning versus problem solving:** the primary ML.ENERGY preprint labels the compared tasks `Problem Solving (reasoning on)` and `Text Conversation (reasoning off)`. The public Czech page therefore calls the measured task `řešení problémů` and uses `usuzování (reasoning)` only for the enabled mode. Czech academic usage supports `usuzování`, for example the FEL ČVUT programme uses `logické usuzování`. Sources: [ML.ENERGY / arXiv](https://arxiv.org/abs/2601.22076), [FEL ČVUT – Umělá inteligence](https://oi.fel.cvut.cz/cs/mgr-minor-umela-inteligence).
- **Prompt:** the Czech Digital and Information Agency defines a prompt as a `vstupní instrukce nebo otázka` and also uses `vstupní zadání (prompt)`. The page uses `vstupní zadání (prompt)` at first substantive mention and the established shorter form thereafter. Source: [DIA – Slovníček AI](https://egovai.dia.gov.cz/slovnicek.html).
- **LCA terminology:** the Ministry of the Environment/VŠCHT study uses `posuzování životního cyklu (LCA)`, `funkční jednotka` and `hranice systému`, with explicit reference to ČSN EN ISO 14040 and 14044. Source: [MŽP – studie LCA](https://mzp.gov.cz/sites/default/files/tiskove-zpravy/LCA%20-%20studie%20final.pdf).
- **Location-based and market-based accounting:** the official Czech ESRS text uses `metoda založená na lokalitě` and `metoda založená na trhu`. These replace the less transparent calques `lokační` and `tržní metoda`. Source: [EUR-Lex – nařízení (EU) 2023/2772, ESRS E1](https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX:02023R2772-20231222).
- **General-purpose AI:** the official Czech AI Act uses `obecný model AI` and `poskytovatel obecných modelů AI`. The page expands the category before using the English acronym GPAI. Source: [EUR-Lex – nařízení (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX:32024R1689).

English originals are added at the first substantive occurrence when they help readers identify a source term, legal category or technical method. They are not repeated mechanically where the Czech wording is already unambiguous.

## Protected bilingual facts

- 0.24 Wh; 0.03 gCO₂e; 0.26 mL; component values 0.14/0.06/0.02/0.02 Wh.
- 95 J and 2,192 J; ratios 23×, approximately 25× and over 100×.
- Water examples: 500 mL per roughly 10–50 responses; 45 mL for a 400-token Le Chat response.
- US water layers: 66 billion L direct and nearly 800 billion L indirect in 2023 for all US data centres.
- US AI-server scenarios: annual 731–1,125 million m³ water and 24–44 MtCO₂e during 2024–2030; projections, not observations.
- IEA: 485 TWh in 2025; 950 TWh in 2030; around 3%; +17%; +50%.
- US scenarios: 649 TWh reference; 521–843 TWh and 9.5–15.3% sensitivity range.
- Ireland: 23% in 2025, 22% in 2024, 5% in 2015.
- Meta: 39.3 million H100 GPU-hours; 11,390 tCO₂e.
- ICLR development case: at least 493 tCO₂e and 2.769 million L; development about half the impact of final training in that programme.
- Material analysis: one Nvidia A100; 32 detected elements; GPU-only scope.
- E-waste: 1.2–5.0 million t cumulative over 2020–2030; 131.0–224.8 kt/year in 2030.
- EU reporting threshold: at least 500 kW installed IT power demand.
- EU roadmap: rating-scheme adoption planned in 2026; first labels planned for 2027. This is not an operative label.
- Wider digital context: approximately 77 Wh for one hour in the IEA's historical 2019 streaming scenario; 229 kg CO₂e for a modelled annual profile of 3 230 hours in Istrate et al. The values are not converted into AI-equivalence ratios.
- Czech AI Factory: announced 12 May 2026; nearly CZK 1 billion; approximately half for KarolAIna acquisition and operation.
- Page/source update date: 19 July 2026.

## Parity rules

- Both pages keep the same 13 section IDs, 22 displayed source entries, citation anchors and 5 quiz cards.
- Parity is semantic and evidential, not sentence-by-sentence. Czech may split, reorder or recast a passage when that improves comprehension, provided the claim strength, scope, caveat and citation remain attached.
- External source URLs and source order must be identical.
- Quantitative strings may use Czech decimal commas in visible prose, but machine QA must confirm numeric equivalence.
- The English page links to `cs.html`; the Czech page links back to `index.html`.
- Both pages are light-only and use the same embedded CSS/interaction structure.
