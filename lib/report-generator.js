// AI/ML Module: Report Generator
// Generates structured welfare gap analysis reports with AI-driven narrative

import { calculateAllGapScores, calculateCountryGapScores, getGapSummaryStats } from './gap-scoring';
import { species } from '../data/species';
import { welfareStandards } from '../data/welfare-standards';

function generateExecutiveSummary(stats, topGaps) {
  const criticalSpecies = topGaps.filter(g => g.priorityLevel === 'Critical');
  const speciesNames = criticalSpecies.slice(0, 5).map(g => g.speciesName).join(', ');
  
  return `## Executive Summary

This report analyzes welfare standards coverage across **${stats.totalSpeciesTracked} aquatic species** farmed in **${stats.totalCountriesTracked} countries**. Our AI-powered gap analysis reveals significant welfare blind spots affecting billions of animals annually.

### Key Findings

- **${stats.speciesWithNoStandards} species** (${Math.round(stats.speciesWithNoStandards/stats.totalSpeciesTracked*100)}% of tracked species) have **zero welfare certification** coverage
- **${stats.percentProductionUncovered}%** of global aquaculture production by volume operates without any welfare standard
- **${stats.countriesWithNoLegislation} countries** lack any form of aquatic animal welfare legislation
- **${stats.criticalPrioritySpecies} species** are classified as **Critical Priority** for intervention
- Average welfare gap score across all species: **${stats.averageGapScore}/1.00**

### Highest-Priority Species for Intervention

The following species represent the highest-impact intervention targets based on our multi-factor analysis: **${speciesNames}**.

These species combine high production volumes, strong sentience evidence, and minimal or no welfare protections — representing the greatest opportunity to reduce suffering at scale.`;
}

function generateSpeciesAnalysis(gaps, filters) {
  let filteredGaps = gaps;
  if (filters?.taxonomicGroup && filters.taxonomicGroup !== 'All') {
    filteredGaps = gaps.filter(g => g.taxonomicGroup === filters.taxonomicGroup);
  }
  
  const sections = filteredGaps.slice(0, 15).map((gap, i) => {
    const sp = species.find(s => s.id === gap.speciesId);
    const concerns = sp?.keyWelfareConcerns?.slice(0, 4).map(c => `  - ${c}`).join('\n') || '  - No data available';
    
    return `### ${i + 1}. ${gap.speciesName} *(${sp?.scientificName || 'N/A'})*

| Metric | Value |
|--------|-------|
| Gap Score | **${gap.compositeScore}** (${gap.priorityLevel}) |
| Annual Production | ${(gap.annualProduction / 1000000).toFixed(1)}M tonnes |
| Estimated Individuals | ${gap.annualIndividuals} |
| Sentience Score | ${gap.components.sentienceEvidence} |
| Welfare Coverage | ${Math.round(gap.welfareStandardsCoverage * 100)}% |
| Existing Schemes | ${gap.existingSchemes.length > 0 ? gap.existingSchemes.join(', ') : 'None'} |
| Top Producers | ${gap.topProducers.join(', ')} |

**Key Welfare Concerns:**
${concerns}

**Recommended Interventions:**
${generateInterventionRecommendations(gap, sp)}
`;
  });

  return `## Species-Level Gap Analysis

Ranked by composite welfare gap score (higher = higher priority for intervention):

${sections.join('\n---\n\n')}`;
}

function generateInterventionRecommendations(gap, speciesData) {
  const recommendations = [];
  
  if (gap.components.standardsGap > 0.8) {
    recommendations.push('  - **Develop species-specific welfare standards** — No meaningful certification exists. Collaborate with ASC/BAP to create species-appropriate criteria.');
  }
  if (gap.components.regulatoryGap > 0.6) {
    recommendations.push('  - **Advocate for legislative inclusion** — Push for recognition of this species in national animal welfare laws in top-producing countries.');
  }
  if (speciesData && speciesData.keyWelfareConcerns?.some(c => c.toLowerCase().includes('stunning'))) {
    recommendations.push('  - **Implement humane slaughter protocols** — Develop and deploy effective stunning technology appropriate for this species.');
  }
  if (speciesData && speciesData.keyWelfareConcerns?.some(c => c.toLowerCase().includes('density') || c.toLowerCase().includes('crowding'))) {
    recommendations.push('  - **Establish maximum stocking density limits** — Current densities likely cause chronic stress. Science-based density standards needed.');
  }
  if (gap.components.sentienceEvidence > 0.7 && gap.components.standardsGap > 0.5) {
    recommendations.push('  - **Fund species-specific welfare research** — Strong sentience evidence exists but welfare indicators for this species are underdeveloped.');
  }
  if (speciesData && speciesData.keyWelfareConcerns?.some(c => c.toLowerCase().includes('eyestalk'))) {
    recommendations.push('  - **Eliminate eyestalk ablation** — Transition to non-ablation broodstock management techniques already available.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('  - **Conduct baseline welfare assessment** — Insufficient data to make specific recommendations. Needs initial welfare audit.');
  }
  
  return recommendations.join('\n');
}

function generateRegionalAnalysis(countryGaps, filters) {
  let filtered = countryGaps;
  if (filters?.region && filters.region !== 'All') {
    filtered = countryGaps.filter(g => g.region === filters.region);
  }
  
  // Group by region
  const regionGroups = {};
  filtered.forEach(g => {
    if (!regionGroups[g.region]) regionGroups[g.region] = [];
    regionGroups[g.region].push(g);
  });
  
  const regionSections = Object.entries(regionGroups).map(([region, gaps]) => {
    const avgGap = (gaps.reduce((sum, g) => sum + g.gapScore, 0) / gaps.length).toFixed(2);
    const totalProduction = gaps.reduce((sum, g) => sum + g.production, 0);
    const withLeg = gaps.filter(g => g.hasLegislation).length;
    
    const countryRows = gaps.slice(0, 8).map(g => 
      `| ${g.countryName} | ${(g.production / 1000000).toFixed(1)}M | ${g.hasLegislation ? (g.enforced ? '✅ Enforced' : '⚠️ Not enforced') : '❌ None'} | ${g.certifiedPercent}% | ${g.gapScore} (${g.priorityLevel}) |`
    ).join('\n');
    
    return `### ${region}

**Regional Summary:** Average gap score ${avgGap} | ${gaps.length} countries | ${(totalProduction / 1000000).toFixed(1)}M tonnes total | ${withLeg}/${gaps.length} have legislation

| Country | Production | Legislation | Certified | Gap Score |
|---------|-----------|-------------|-----------|-----------|
${countryRows}
`;
  });

  return `## Regional Analysis

${regionSections.join('\n---\n\n')}`;
}

function generateCertificationAnalysis() {
  const certSections = welfareStandards.map(std => {
    const criteria = Object.entries(std.welfareCriteria).map(([key, val]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      const bar = '█'.repeat(Math.round(val.stringency * 10)) + '░'.repeat(10 - Math.round(val.stringency * 10));
      return `| ${label} | ${val.covered ? '✅' : '❌'} | ${bar} ${(val.stringency * 100).toFixed(0)}% |`;
    }).join('\n');
    
    return `### ${std.name} (${std.abbreviation})

**Overall Stringency:** ${(std.overallStringencyScore * 100).toFixed(0)}% | **Welfare-Specific:** ${(std.welfareSpecificScore * 100).toFixed(0)}% | **Certified Farms:** ${std.certifiedFarms.toLocaleString()} | **Species Covered:** ${std.speciesCovered.length}

| Welfare Criteria | Covered | Stringency |
|-----------------|---------|------------|
${criteria}
`;
  });

  return `## Certification Scheme Analysis

Comparative analysis of ${welfareStandards.length} major aquatic welfare certification schemes:

${certSections.join('\n---\n\n')}`;
}

function generateMethodology() {
  return `## Methodology

### Data Sources
- **Production data:** FAO FishStatJ 2024, State of World Fisheries and Aquaculture (SOFIA) 2024
- **Welfare standards:** Direct review of ASC, BAP, GlobalGAP, RSPCA Assured, Naturland, EU Organic, and FOS certification requirements (2024 versions)
- **Sentience evidence:** Systematic review of peer-reviewed literature (Sneddon 2015, Birch 2021, Crump 2022, and others)
- **Regulatory data:** National legislation databases and OIE (WOAH) aquatic animal health code

### Gap Scoring Algorithm

The Welfare Gap Score uses a weighted multi-factor model:

| Factor | Weight | Description |
|--------|--------|-------------|
| Production Scale | 25% | Normalized annual production volume — higher production = more animals affected |
| Sentience Evidence | 20% | Strength of scientific evidence for pain/suffering capacity |
| Standards Gap | 25% | Absence of welfare certification coverage (1 - coverage%) |
| Regulatory Gap | 15% | Absence of enforced legislation in top-producing countries |
| Intervention Feasibility | 15% | Technical feasibility of welfare improvements |

**Composite Score** = Σ (Weight × Factor), range 0-1, where higher scores indicate higher priority.

**Priority Classification:**
- **Critical** (≥0.70): Immediate intervention needed
- **High** (≥0.50): Significant welfare gaps requiring attention
- **Medium** (≥0.35): Notable gaps with some existing frameworks
- **Low** (<0.35): Relatively well-covered or low welfare concern

### Limitations
- Production data from FAO may underreport in some countries
- Sentience scores are based on available research, which is biased toward commercially important species
- Certification coverage estimates based on publicly available data
- This is a prototype analysis; a full assessment would require primary data collection`;
}

export function generateReport(filters = {}) {
  const stats = getGapSummaryStats();
  const speciesGaps = calculateAllGapScores();
  const countryGaps = calculateCountryGapScores();
  
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const report = `# 🐟 Aquatic Animal Welfare Gap Analysis Report

**Generated:** ${date}
**Filters Applied:** ${filters.taxonomicGroup && filters.taxonomicGroup !== 'All' ? `Species Group: ${filters.taxonomicGroup}` : 'All Species'} | ${filters.region && filters.region !== 'All' ? `Region: ${filters.region}` : 'All Regions'} | ${filters.productionSystem && filters.productionSystem !== 'All' ? `System: ${filters.productionSystem}` : 'All Systems'}

---

${generateExecutiveSummary(stats, speciesGaps)}

---

${generateSpeciesAnalysis(speciesGaps, filters)}

---

${generateRegionalAnalysis(countryGaps, filters)}

---

${generateCertificationAnalysis()}

---

${generateMethodology()}

---

*Report generated by the Aquatic Animal Welfare Tracker — an AI-powered analysis tool. Data sourced from FAO, ASC, BAP, RSPCA, academic literature, and national legislation databases.*
`;

  return report;
}
