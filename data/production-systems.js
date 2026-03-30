// Production systems data
// Sources: FAO Technical Papers, academic review articles (2022-2024)

export const productionSystems = [
  {
    id: 'pond',
    name: 'Pond Culture',
    description: 'Earthen ponds (extensive to intensive). Most common global system, especially in Asia.',
    globalSharePercent: 52,
    speciesCompatible: ['Nile Tilapia', 'Common Carp', 'Grass Carp', 'Silver Carp', 'Bighead Carp', 'Catla', 'Rohu', 'Pangasius (Basa)', 'Whiteleg Shrimp', 'Channel Catfish', 'Milkfish', 'Red Swamp Crayfish', 'Snakehead', 'Largemouth Bass'],
    prevalentRegions: ['East Asia', 'South Asia', 'Southeast Asia', 'South America'],
    welfareImplications: {
      positives: ['More natural substrate', 'Some foraging opportunity', 'Exposure to natural light cycles'],
      negatives: ['Water quality fluctuation', 'Risk of oxygen depletion', 'Limited monitoring capability', 'Predator exposure', 'Disease spread in polyculture'],
      overallWelfareScore: 0.35
    },
    intensityLevels: ['Extensive', 'Semi-intensive', 'Intensive'],
    icon: '🏊'
  },
  {
    id: 'cage-netpen',
    name: 'Cage / Net-Pen',
    description: 'Floating or submerged cages in lakes, rivers, or ocean. Primary system for salmon and marine finfish.',
    globalSharePercent: 12,
    speciesCompatible: ['Atlantic Salmon', 'Rainbow Trout', 'European Seabass', 'Gilthead Seabream', 'Japanese Amberjack (Yellowtail)', 'Barramundi', 'Atlantic Cod', 'Nile Tilapia'],
    prevalentRegions: ['Northern Europe', 'Southern Europe', 'East Asia', 'Southeast Asia'],
    welfareImplications: {
      positives: ['Natural water flow', 'Oxygen from current', 'Some environmental stimulation'],
      negatives: ['Limited space for free-ranging pelagic species', 'Sea lice/parasite exposure', 'Entanglement risk', 'Storm/weather events', 'Escapes cause stress'],
      overallWelfareScore: 0.45
    },
    intensityLevels: ['Semi-intensive', 'Intensive'],
    icon: '🔲'
  },
  {
    id: 'raceway',
    name: 'Raceway / Flow-Through',
    description: 'Long narrow channels with continuous water flow. Common for trout production.',
    globalSharePercent: 5,
    speciesCompatible: ['Rainbow Trout', 'Atlantic Salmon'],
    prevalentRegions: ['Western Europe', 'North America', 'Western Asia'],
    welfareImplications: {
      positives: ['Continuous clean water', 'Stable water quality', 'Good oxygen levels'],
      negatives: ['Uniform environment (no enrichment)', 'Limited behavioral repertoire', 'High current stress possible', 'No substrate or hiding places'],
      overallWelfareScore: 0.50
    },
    intensityLevels: ['Intensive'],
    icon: '🌊'
  },
  {
    id: 'ras',
    name: 'Recirculating Aquaculture System (RAS)',
    description: 'Indoor tank systems with water filtration and recirculation. Growing for salmon and high-value species.',
    globalSharePercent: 3,
    speciesCompatible: ['Atlantic Salmon', 'Rainbow Trout', 'Barramundi', 'Atlantic Cod'],
    prevalentRegions: ['Northern Europe', 'North America'],
    welfareImplications: {
      positives: ['Controlled environment', 'Stable water quality', 'No parasite exposure', 'No weather events', 'Potential for enrichment'],
      negatives: ['Completely artificial environment', 'System failure risk (catastrophic loss)', 'No natural stimuli', 'High density typical', 'Noise and vibration'],
      overallWelfareScore: 0.55
    },
    intensityLevels: ['Intensive', 'Super-intensive'],
    icon: '🏭'
  },
  {
    id: 'integrated',
    name: 'Integrated (Rice-Fish, IMTA)',
    description: 'Multi-trophic or crop-aquaculture integration. Traditional in Asia, growing interest globally.',
    globalSharePercent: 15,
    speciesCompatible: ['Common Carp', 'Nile Tilapia', 'Red Swamp Crayfish', 'Grass Carp', 'Giant River Prawn'],
    prevalentRegions: ['East Asia', 'South Asia', 'Southeast Asia'],
    welfareImplications: {
      positives: ['More natural environment', 'Foraging opportunity', 'Environmental complexity', 'Lower density typical'],
      negatives: ['Less monitoring', 'Pesticide/herbicide exposure in rice paddies', 'Predator exposure', 'Temperature extremes'],
      overallWelfareScore: 0.40
    },
    intensityLevels: ['Extensive', 'Semi-intensive'],
    icon: '🌾'
  },
  {
    id: 'bottom-culture',
    name: 'Bottom / Seabed Culture',
    description: 'Shellfish grown on or near the seabed. Used for oysters, clams, and mussels.',
    globalSharePercent: 8,
    speciesCompatible: ['Pacific Oyster', 'Manila Clam', 'Yesso Scallop', 'Abalone'],
    prevalentRegions: ['East Asia', 'Western Europe', 'North America', 'Oceania'],
    welfareImplications: {
      positives: ['Natural environment', 'Filter-feeding from natural water', 'Low intervention'],
      negatives: ['Dredging harvest stress', 'Predator exposure', 'Environmental extremes'],
      overallWelfareScore: 0.60
    },
    intensityLevels: ['Extensive'],
    icon: '🦪'
  },
  {
    id: 'suspended',
    name: 'Suspended / Longline / Rack',
    description: 'Shellfish suspended from ropes, racks, or bags. Common for oysters and mussels.',
    globalSharePercent: 5,
    speciesCompatible: ['Pacific Oyster', 'Blue Mussel', 'Yesso Scallop'],
    prevalentRegions: ['East Asia', 'Western Europe', 'Oceania'],
    welfareImplications: {
      positives: ['Good water flow', 'Reduced predation', 'Natural feeding'],
      negatives: ['Handling during maintenance', 'Exposure to air during servicing', 'Crowding on ropes'],
      overallWelfareScore: 0.65
    },
    intensityLevels: ['Semi-intensive'],
    icon: '🪢'
  }
];

export function getSystemById(id) {
  return productionSystems.find(s => s.id === id);
}

export function getSystemsForSpecies(speciesName) {
  return productionSystems.filter(s => s.speciesCompatible.includes(speciesName));
}
