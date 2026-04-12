# Add Documents Impact - Defensible Offer/EA Estimate

- Generated: 11 April 2026
- Source: `docs/add-documents-adoption-impact.md` (589 Add Documents adopters)
- Environment lock: Offer values in this source are SANDBOX; EA values are currently PROD-derived from `data-employment-agreement-durations.ts`.
- Metric-definition lock: this report estimates operational BP event-duration level shifts (`post_days - pre_days`), not the tracker chain metric (`Time in Offer/EA` from first event start to final completed event on one job application).
- Cohort gate for primary estimate: Offer `pre_m/post_m >= 3`; EA `pre_m/post_m >= 1`. (Auto-fallback from 6 when strict gate returns underpowered cohorts.)

## PM / DS Bottom Line
- A single full-cohort Offer/EA impact remains non-defensible while Offer and EA are environment-misaligned and chain-metric definitions are not yet implemented.
- With strict cohort rules, we can provide directional operational estimates using level effects, winsorised means, and uncertainty ranges.

## Primary Estimates (days)

| Outcome | Cohort n | Pre median | Post median | Median level change | Winsor mean change (5-95) | 95% CI | Weighted level change* | Avg pre m | Avg post m |
|---|---:|---:|---:|---:|---:|---|---:|---:|---:|
| Offer | 10 | 0.125 | 0.015 | -0.125 | -29.737 | [-59.312, -4.382] | -32.638 | 3.20 | 4.00 |
| Employment Agreement | 14 | 0.015 | 0.020 | 0.000 | 0.189 | [-0.135, 0.566] | 0.235 | 4.50 | 5.00 |

*Weighting uses month-coverage proxy (`min(pre_m, post_m)`) because explicit event volumes are not available in the current table.

## Sensitivity: threshold and winsorisation

### Offer
| min pre/post m | winsor | n | median level change | winsor mean change |
|---:|---|---:|---:|---:|
| 3 | none | 10 | -0.125 | -29.737 |
| 3 | w10-90 | 10 | -0.125 | -29.737 |
| 3 | w05-95 | 10 | -0.125 | -29.737 |
| 6 | none | 0 | n/a | n/a |
| 6 | w10-90 | 0 | n/a | n/a |
| 6 | w05-95 | 0 | n/a | n/a |
| 9 | none | 0 | n/a | n/a |
| 9 | w10-90 | 0 | n/a | n/a |
| 9 | w05-95 | 0 | n/a | n/a |

### Employment Agreement
| min pre/post m | winsor | n | median level change | winsor mean change |
|---:|---|---:|---:|---:|
| 3 | none | 4 | 0.460 | 0.513 |
| 3 | w10-90 | 4 | 0.460 | 0.513 |
| 3 | w05-95 | 4 | 0.460 | 0.513 |
| 6 | none | 0 | n/a | n/a |
| 6 | w10-90 | 0 | n/a | n/a |
| 6 | w05-95 | 0 | n/a | n/a |
| 9 | none | 0 | n/a | n/a |
| 9 | w10-90 | 0 | n/a | n/a |
| 9 | w05-95 | 0 | n/a | n/a |

## Segment consistency (available dimensions in this artefact)

### Offer
| Segment | n | median level change | winsor mean change |
|---|---:|---:|---:|
| adoption-year-2023 | 0 | n/a | n/a |
| adoption-year-2024 | 0 | n/a | n/a |
| adoption-year-2025 | 7 | -31.510 | -42.587 |
| adoption-year-2026 | 3 | 0.010 | 0.247 |
| baseline-<1d | 6 | -0.005 | 0.082 |
| baseline->=1d | 4 | -73.335 | -74.465 |

### Employment Agreement
| Segment | n | median level change | winsor mean change |
|---|---:|---:|---:|
| adoption-year-2023 | 0 | n/a | n/a |
| adoption-year-2024 | 0 | n/a | n/a |
| adoption-year-2025 | 8 | 0.000 | 0.174 |
| adoption-year-2026 | 6 | 0.010 | 0.208 |
| baseline-<1d | 11 | 0.000 | 0.028 |
| baseline->=1d | 3 | 0.940 | 0.777 |

## Trend sanity checks (control-style outcomes)

| Outcome | n | median level change | winsor mean change | 95% CI |
|---|---:|---:|---:|---|
| Time to Fill (TTF) | 7 | 0.000 | 2.143 | [-3.286, 8.143] |
| Time to Hire (TTH) | 28 | 5.855 | 8.256 | [0.239, 16.317] |

## Caveats and next data steps
- This is not a causal estimate; it is a stricter association summary.
- Offer and EA remain environment-misaligned in this source.
- Next step for PM-grade headline: rebuild from warehouse with explicit event volumes and one environment, then run fixed-effects event-study / DiD panel.
- Tracker chain metric remains a separate workstream until job-application event chaining is implemented.

