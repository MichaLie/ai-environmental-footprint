# Quantitative derivations and prohibited comparisons

- **Recomputed:** 2026-07-18
- **Rule:** displayed ratios are calculated only when numerator and denominator share the same study, unit, task definition and measurement boundary.

## Values used on the site

### Google television equivalence

The provider-authored production study reports `0.24 Wh` for the median Gemini Apps text prompt in May 2025 and uses a `100 W` modern television comparison.

`0.24 Wh / 100 W x 3,600 s/h = 8.64 s`

Displayed wording: **roughly 8.6 seconds of a 100 W television**. The page also labels the study as a provider-authored preprint and keeps the May 2025 Gemini Apps scope attached.

### Historical streaming-energy unit conversion

The IEA's updated historical scenario reports `0.077 kWh` for one hour of typical video streaming in 2019. The page changes only the energy unit:

`0.077 kWh x 1,000 Wh/kWh = 77 Wh`

Displayed wording: **approximately 77 Wh for one hour of typical viewing in the IEA's 2019 scenario**. The source's date, device/network/data-centre boundary and sensitivity to screen, connection and resolution remain attached. This conversion is not a new estimate of current streaming.

### Same-model reasoning benchmark

ML.ENERGY reports Qwen 3 32B on one B200 at `95 J` per text-conversation response and `2,192 J` per problem-solving response.

`2,192 J / 95 J = 23.0737`

Displayed wording: **23x in this benchmark**. The paper's table rounds to `23x`.

Across the study's minimum-energy B200 configurations, the reported means are `184 J` for text conversation and `4,625 J` for problem solving.

`4,625 J / 184 J = 25.1359`

Displayed wording: **about 25x on average in this benchmark**. The site does not treat either ratio as a universal service multiplier.

### Global data-centre outlook

The IEA central projection is `485 TWh` in 2025 and `950 TWh` in 2030.

`950 / 485 = 1.9588`

`(950 - 485) / 485 x 100 = 95.8763%`

Displayed wording: **roughly doubles**. Both values cover all data centres; the separate IEA statement that AI-focused data-centre consumption triples over the period remains labelled as a projection.

### United States outlook

Berkeley Lab directly reports the following 2030 values, so the site does not reconstruct them from component assumptions:

- reference case: `649 TWh`, `11.8%` of forecast US electricity use;
- compounded uncertainty range: `521-843 TWh`, `9.5-15.3%`.

These are bottom-up scenarios for all US data centres.

## Comparisons deliberately not calculated

### AI and other digital activities

The page does **not** divide the IEA streaming scenario (`77 Wh per viewing hour`) by the Google production result (`0.24 Wh per median text prompt`). The services, dates, functional units and accounting boundaries differ. A numerical quotient would be arithmetically possible but environmentally misleading.

The page also does **not** convert Istrate et al.'s annual lifecycle result (`229 kg CO2e` for a modelled `3,230 h` global-average digital-content profile) into either a per-hour or per-prompt constant. It combines five content categories, multiple devices, cradle-to-grave infrastructure and older behaviour/technology inputs. It is presented as a modelled annual context, not a current measurement or an AI comparator.

The `8.64 s` television statement above remains a physical energy conversion against a fixed `100 W` load. It is not equated with streamed television viewing and does not include the television, network or content-delivery lifecycle.

### Water

The page does **not** divide Mistral's `45 mL` by Google's `0.26 mL`, and it does not convert Ren et al.'s `500 mL per roughly 10-50 medium responses` into a supposedly universal per-response value. The systems, dates, workloads, methods and environmental boundaries differ.

The page also does **not** divide or rank LBNL's 2023 US data-centre water totals (`66 billion L` direct; nearly `800 billion L` attributed to electricity supply) against Xiao et al.'s modelled 2024–2030 US AI-server range (`731–1,125 million m³`). They differ in population, time basis, accounting model and system boundary. No unit conversion is used to imply comparability.

### Electronic waste

The page does **not** compare the Nature study's `1.2-5.0 million tonnes accumulated during 2020-2030` with de Vries-Gao's `131.0-224.8 kilotonnes per year in 2030` as if they shared a time basis or model. One is cumulative and one is annual; the methods and scopes also differ.

### Training disclosures

Provider disclosures are examples, not a ranking. Meta's Llama 3.1 family model card and Mistral's lifecycle study use different systems, periods, categories and accounting conventions. No ratio is calculated between them.

### Model development and material footprint

The ICLR lifecycle case (`493 tCO2e`, `2.769 million L`, about half of emissions attributed to training) is reported as one documented development process. It is not scaled to other model sizes or used as a generic training-to-development multiplier.

The `32 elements` material result is a count within the accelerator components assessed by the study. It is not extrapolated to whole servers, data centres, mining impacts or a per-prompt material footprint.
