// Utility functions that derive aggregate values from the species dataset.
// Separated from data/species.js to keep data files as pure data constants.

import { species } from '../data/species';

export function getTaxonomicGroups() {
  return [...new Set(species.map(s => s.taxonomicGroup))];
}

export function getTotalProduction() {
  return species.reduce((sum, s) => sum + s.annualProductionTonnes, 0);
}
