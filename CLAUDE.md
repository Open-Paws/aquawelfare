# AquaWelFare — Agent Instructions

## What This Is

AquaWelFare is an aquatic animal welfare intelligence platform adopted by Open Paws following decision #26 (aquatic animal advocacy explicitly in scope). Originally built by Arun Saini at the Code for Compassion hackathon (MIT license), it covers welfare gap data for 40+ countries and 35+ species, with an interactive policy intervention simulator.

This is a public-facing advocacy tool, not investigation infrastructure. It operates in the **Public Campaigns** bounded context (see advocacy domain rules). Aquatic farmed animals — salmon, shrimp, tilapia, and others — represent billions of individuals with near-zero legislative protection. This tool makes that gap visible and actionable.

Strategy context: the scope decision and adoption rationale live at `open-paws-strategy/closed-decisions.md` (search for decision #26).

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Geospatial:** react-leaflet + leaflet (choropleth welfare gap map)
- **Data visualization:** Recharts (area, radar, bar, pie)
- **PDF export:** html2pdf.js (downloadable advocacy reports)
- **Icons:** lucide-react
- **Markdown rendering:** react-markdown
- **Data layer:** Static JS modules in `data/` — no backend database

## Key Files

| Path | Purpose |
|------|---------|
| `data/countries.js` | Welfare data for 40+ countries — regulatory frameworks, enforcement, certification coverage |
| `data/species.js` | Profiles for 35+ farmed aquatic species — sentience evidence, production volumes, top producers |
| `data/welfare-standards.js` | Global welfare certification standards (ASC, GlobalGAP, etc.) |
| `data/production-systems.js` | Aquaculture production system types |
| `lib/gap-scoring.js` | Multi-factor welfare gap scoring algorithm (production scale, sentience evidence, standards gap, regulatory gap, intervention feasibility) |
| `lib/report-generator.js` | PDF advocacy report generation logic |
| `components/WorldMap.jsx` | Interactive choropleth map — countries color-coded by welfare gap score |
| `components/InterventionSimulator.jsx` | "What-if" policy simulator projecting animal welfare outcomes |
| `components/AISuite.jsx` | Predictive 2030 forecasting + NLP policy sentiment grader |
| `components/GapAnalysis.jsx` | Welfare gap analysis engine UI |
| `components/SpeciesExplorer.jsx` | Species browsing and detail views |
| `components/WelfareCharts.jsx` | Recharts-based data visualization |
| `components/ReportPanel.jsx` | PDF report generation UI |
| `components/FilterPanel.jsx` | Country/species filtering controls |
| `components/StatsOverview.jsx` | High-level welfare statistics dashboard |
| `app/layout.js` | Root layout — metadata, font loading, Leaflet CSS |
| `app/page.js` | Main page entry point |
| `app/api/` | Next.js API routes for countries, species, welfare-gaps, reports |

## Domain Rules

This repo is in the **Public Campaigns** bounded context. Terminology rules from the advocacy domain apply:

- Farmed aquatic animals — not "seafood" or "aquatic livestock"
- Welfare gap — use this term for the scoring model output, not "deficit" or "shortfall"
- Intervention — specific policy or certification change projected in the simulator
- Campaign — any organized advocacy effort this tool supports
- Use "slaughter" and "slaughterhouse" terminology for kill facilities in aquaculture — do not use industry euphemisms like "harvest facility", "processing facility", or "processing plant"

Never use speciesist language in code, comments, or variable names. Run the no-animal-violence linter before committing.

## Seven Concerns

**1. Testing**
No tests exist in the original codebase. The onboarding issue tracks this. Priority test targets:
- `lib/gap-scoring.js` — multi-factor scoring is pure logic, ideal for unit tests
- `lib/report-generator.js` — data transformation logic
- API route handlers in `app/api/`
Use Vitest. Spec-first. Every test must fail when the covered behavior breaks.

**2. Security**
This is a public-facing tool with static data — moderate risk. Key concerns:
- The NLP policy sentiment grader (`AISuite.jsx`) accepts text input. Validate and sanitize input.
- No investigation data flows through this tool — it is public campaign infrastructure only.
- PDF generation via html2pdf.js runs client-side — no server-side data retention risk.
- Verify all dependencies exist and have legitimate maintainers (check package-lock.json).
- No API keys or credentials in the codebase — data is static JS modules.

**3. Privacy**
No user accounts, no PII collection. Low privacy risk in current state. If user accounts or report-saving features are added in future:
- Use pseudonymous identifiers for any analytics
- Real deletion (not soft delete)
- Apply activist identity protection standards

**4. Cost optimization**
This tool has no AI API calls in production (the "AI Suite" runs JavaScript heuristics locally). Cost concern is minimal for runtime. For development:
- Route Claude tasks to the cheapest capable model
- Track cost per PR
- Static data layer avoids ongoing API costs — preserve this unless a live data source offers clear advocacy value

**5. Advocacy domain**
Data accuracy matters for credibility. Welfare gap scores feed into policy advocacy claims. When updating `data/` files:
- Source all statistics (FAO, ASC, peer-reviewed welfare science)
- Document sources in comments within data files
- Do not inflate gap scores — advocates citing incorrect numbers undermines the movement

**6. Accessibility**
Current state: dark-mode-first glassmorphism design. Audit needed for:
- Screen reader navigation (ARIA labels on the map, charts)
- Keyboard-only flow through the intervention simulator
- Color contrast in the choropleth map (welfare gap heat map must be readable without color alone)
- Low-bandwidth fallback for the map tile layer
- i18n: English only currently — French and Spanish are high-priority additions given the global scope of the data

**7. Emotional safety**
This tool describes suffering at scale (billions of animals). Apply progressive disclosure:
- Species sentience evidence descriptions should not auto-load graphic content
- Welfare gap scores are numbers — keep visualization clinical, not viscerally graphic
- The 2030 forecasting chart shows explosive growth of unprotected animals — include context about intervention impact to avoid despair without action path

## Quality Gates

- **desloppify:** Target score ≥ 85. Run `desloppify scan --path .` then `desloppify next`.
- **no-animal-violence:** GitHub Action runs on every PR. Run locally with the pre-commit hook.
- **TypeScript:** Currently JavaScript (`.js`/`.jsx`). If migrating to TypeScript, run `tsc --noEmit` before pushing.
- **Playwright:** Use for persona-based testing of the map interaction, intervention simulator, and report download flows.

## Personas for Playwright Testing

1. **Policy researcher** — loads the map, filters by region, runs the intervention simulator, downloads PDF report
2. **NGO campaigner** — browses species profiles, identifies highest-gap species, shares report
3. **Developer contributor** — explores code, runs dev server, verifies map loads without errors

## Original Attribution

Original work by Arun Saini (Arun-Saini05/AquaWelFare). MIT license. Open Paws adoption adds strategy context, quality gates, and long-term maintenance. Contact Arun about ongoing contributions — see the onboarding issue.

## Cross-References

- Scope decision: `open-paws-strategy/closed-decisions.md` (decision #26)
- Advocacy domain language: `open-paws-strategy/.claude/rules/advocacy-domain.md`
- Quality gates: `open-paws-strategy/.claude/rules/desloppify.md`
- Cost optimization: `open-paws-strategy/.claude/rules/cost-optimization.md`
- Ecosystem entry: `open-paws-strategy/ecosystem/repos.md` (pending addition)
