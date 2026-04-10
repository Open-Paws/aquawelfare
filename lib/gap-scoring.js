// Welfare Gap Scoring Algorithm
// Multi-factor scoring model to identify highest-impact intervention targets

import { species } from '../data/species';
import { countries } from '../data/countries';

/**
 * Welfare Gap Score = weighted combination of:
 * - Production Scale (0-1): Normalized production volume (higher = more animals affected)
 * - Sentience Evidence (0-1): Strength of evidence for suffering capacity
 * - Standards Gap (0-1): Absence of welfare certification coverage
 * - Regulatory Gap (0-1): Absence of country-level legislation
 * - Intervention Feasibility (0-1): Technical feasibility of welfare improvements
 * 
 * Higher composite score = higher priority for intervention
 */

const WEIGHTS = {
  productionScale: 0.25,
  sentienceEvidence: 0.20,
  standardsGap: 0.25,
  regulatoryGap: 0.15,
  interventionFeasibility: 0.15,
};

function normalizeProduction(production, maxProduction) {
  return Math.min(production / maxProduction, 1);
}

function calculateStandardsGap(welfareStandardsCoverage) {
  return 1 - welfareStandardsCoverage;
}

function calculateRegulatoryGap(speciesData) {
  const topCountries = speciesData.topProducers;
  const countriesWithLegislation = topCountries.filter(name => {
    const country = countries.find(c => c.name === name);
    return country && country.regulatoryFramework.hasLegislation && country.regulatoryFramework.enforced;
  });
  return 1 - (countriesWithLegislation.length / Math.max(topCountries.length, 1));
}

const FEASIBILITY_BASELINE = 0.5;
const FEASIBILITY_RESEARCH_BONUS = 0.15;     // more research = more we know about improvements
const FEASIBILITY_CERT_BONUS = 0.10;          // existing cert infrastructure
const FEASIBILITY_FISH_BONUS = 0.10;          // stunning technology exists for fish
const FEASIBILITY_CRUSTACEAN_BONUS = 0.05;    // some solutions emerging (electrical stunning)
const FEASIBILITY_SCALE_BONUS = 0.10;         // scale makes intervention impactful
const FEASIBILITY_SCALE_THRESHOLD = 100000;

function calculateInterventionFeasibility(speciesData) {
  // Higher feasibility for species with existing research, established farming
  // and where interventions (stunning, density reduction) are technically possible
  let feasibility = FEASIBILITY_BASELINE;

  if (speciesData.researchCitations && speciesData.researchCitations.length > 0) {
    feasibility += FEASIBILITY_RESEARCH_BONUS;
  }
  if (speciesData.certificationSchemes && speciesData.certificationSchemes.length > 0) {
    feasibility += FEASIBILITY_CERT_BONUS;
  }
  if (speciesData.taxonomicGroup === 'Fish') {
    feasibility += FEASIBILITY_FISH_BONUS;
  } else if (speciesData.taxonomicGroup === 'Crustacean') {
    feasibility += FEASIBILITY_CRUSTACEAN_BONUS;
  }
  if (speciesData.annualProductionTonnes > FEASIBILITY_SCALE_THRESHOLD) {
    feasibility += FEASIBILITY_SCALE_BONUS;
  }

  return Math.min(feasibility, 1);
}

export function calculateGapScore(speciesData) {
  const maxProduction = Math.max(...species.map(s => s.annualProductionTonnes));
  
  const productionScale = normalizeProduction(speciesData.annualProductionTonnes, maxProduction);
  const sentienceEvidence = speciesData.sentienceScore;
  const standardsGap = calculateStandardsGap(speciesData.welfareStandardsCoverage);
  const regulatoryGap = calculateRegulatoryGap(speciesData);
  const interventionFeasibility = calculateInterventionFeasibility(speciesData);
  
  const compositeScore = (
    WEIGHTS.productionScale * productionScale +
    WEIGHTS.sentienceEvidence * sentienceEvidence +
    WEIGHTS.standardsGap * standardsGap +
    WEIGHTS.regulatoryGap * regulatoryGap +
    WEIGHTS.interventionFeasibility * interventionFeasibility
  );
  
  return {
    speciesId: speciesData.id,
    speciesName: speciesData.commonName,
    taxonomicGroup: speciesData.taxonomicGroup,
    compositeScore: Math.round(compositeScore * 100) / 100,
    components: {
      productionScale: Math.round(productionScale * 100) / 100,
      sentienceEvidence: Math.round(sentienceEvidence * 100) / 100,
      standardsGap: Math.round(standardsGap * 100) / 100,
      regulatoryGap: Math.round(regulatoryGap * 100) / 100,
      interventionFeasibility: Math.round(interventionFeasibility * 100) / 100,
    },
    priorityLevel: compositeScore >= 0.7 ? 'Critical' : compositeScore >= 0.5 ? 'High' : compositeScore >= 0.35 ? 'Medium' : 'Low',
    annualProduction: speciesData.annualProductionTonnes,
    annualIndividuals: speciesData.annualIndividuals,
    welfareStandardsCoverage: speciesData.welfareStandardsCoverage,
    existingSchemes: speciesData.certificationSchemes,
    topProducers: speciesData.topProducers,
  };
}

export function calculateAllGapScores() {
  return species
    .map(s => calculateGapScore(s))
    .sort((a, b) => b.compositeScore - a.compositeScore);
}

export function getTopInterventionTargets(n = 10) {
  return calculateAllGapScores().slice(0, n);
}

export function getGapsByGroup(group) {
  return calculateAllGapScores().filter(g => g.taxonomicGroup === group);
}

export function getGapsByPriority(priority) {
  return calculateAllGapScores().filter(g => g.priorityLevel === priority);
}

export function calculateCountryGapScores() {
  return countries.map(country => {
    const legislationScore = country.regulatoryFramework.hasLegislation ? 
      (country.regulatoryFramework.enforced ? 0.2 : 0.6) : 1.0;
    const certificationGap = 1 - (country.certifiedProductionPercent / 100);
    const productionScale = Math.min(country.totalAquacultureProduction / 57470000, 1);
    
    const gapScore = (legislationScore * 0.3 + certificationGap * 0.35 + productionScale * 0.35);
    
    return {
      countryId: country.id,
      countryName: country.name,
      region: country.region,
      gapScore: Math.round(gapScore * 100) / 100,
      welfareScore: country.welfareScore,
      production: country.totalAquacultureProduction,
      certifiedPercent: country.certifiedProductionPercent,
      hasLegislation: country.regulatoryFramework.hasLegislation,
      enforced: country.regulatoryFramework.enforced,
      priorityLevel: gapScore >= 0.7 ? 'Critical' : gapScore >= 0.5 ? 'High' : gapScore >= 0.35 ? 'Medium' : 'Low',
    };
  }).sort((a, b) => b.gapScore - a.gapScore);
}

// Summary statistics
export function getGapSummaryStats() {
  const allGaps = calculateAllGapScores();
  const countryGaps = calculateCountryGapScores();
  
  const speciesWithNoStandards = species.filter(s => s.certificationSchemes.length === 0);
  const countriesWithNoLegislation = countries.filter(c => !c.regulatoryFramework.hasLegislation);
  
  const totalProductionNoStandards = speciesWithNoStandards.reduce((sum, s) => sum + s.annualProductionTonnes, 0);
  const totalProductionAll = species.reduce((sum, s) => sum + s.annualProductionTonnes, 0);
  
  return {
    totalSpeciesTracked: species.length,
    totalCountriesTracked: countries.length,
    speciesWithNoStandards: speciesWithNoStandards.length,
    countriesWithNoLegislation: countriesWithNoLegislation.length,
    percentProductionUncovered: Math.round((totalProductionNoStandards / totalProductionAll) * 100),
    criticalPrioritySpecies: allGaps.filter(g => g.priorityLevel === 'Critical').length,
    highPrioritySpecies: allGaps.filter(g => g.priorityLevel === 'High').length,
    criticalPriorityCountries: countryGaps.filter(g => g.priorityLevel === 'Critical').length,
    averageGapScore: Math.round((allGaps.reduce((sum, g) => sum + g.compositeScore, 0) / allGaps.length) * 100) / 100,
  };
}
