// Welfare standards and certification schemes database
// Sources: ASC 2024, BAP 2024, GlobalGAP 2024, RSPCA Assured 2024, Naturland 2024
// Latest certification data as of 2024

export const welfareStandards = [
  {
    id: 'asc',
    name: 'Aquaculture Stewardship Council (ASC)',
    abbreviation: 'ASC',
    type: 'Certification',
    founded: 2010,
    headquarters: 'Utrecht, Netherlands',
    website: 'https://www.asc-aqua.org',
    description: 'Leading international certification for responsible aquaculture, covering environmental and social criteria with increasing welfare components.',
    speciesCovered: ['Atlantic Salmon', 'Rainbow Trout', 'Nile Tilapia', 'Pangasius (Basa)', 'Whiteleg Shrimp', 'Giant Tiger Prawn', 'European Seabass', 'Gilthead Seabream', 'Barramundi', 'Atlantic Cod', 'Pacific Oyster', 'Manila Clam', 'Yesso Scallop', 'Abalone', 'Milkfish', 'Mozambique Tilapia'],
    countriesActive: ['Norway', 'Chile', 'United Kingdom', 'Canada', 'Vietnam', 'Indonesia', 'Ecuador', 'Thailand', 'Turkey', 'Greece', 'Spain', 'Australia', 'India', 'China', 'Denmark', 'Faroe Islands', 'Iceland', 'South Korea', 'Japan', 'Philippines', 'Brazil', 'Honduras', 'Mexico', 'South Africa'],
    certifiedFarms: 2100,
    welfareCriteria: {
      stockingDensity: { covered: true, stringency: 0.7, details: 'Maximum density limits vary by species' },
      stunning: { covered: true, stringency: 0.6, details: 'Effective stunning required for finfish since CAB v2.2 (2023)' },
      waterQuality: { covered: true, stringency: 0.8, details: 'Dissolved oxygen, pH, temperature monitoring required' },
      handling: { covered: true, stringency: 0.6, details: 'Minimization of handling stress' },
      enrichment: { covered: false, stringency: 0.0, details: 'Not explicitly required' },
      mortality: { covered: true, stringency: 0.7, details: 'Mortality thresholds and reporting required' },
      antibioticUse: { covered: true, stringency: 0.8, details: 'Restrictions and reporting requirements' },
      slaughter: { covered: true, stringency: 0.6, details: 'Humane slaughter requirements' }
    },
    overallStringencyScore: 0.65,
    welfareSpecificScore: 0.55,
    lastUpdated: '2024',
    color: '#00A7E1'
  },
  {
    id: 'bap',
    name: 'Best Aquaculture Practices (BAP)',
    abbreviation: 'BAP',
    type: 'Certification',
    founded: 2002,
    headquarters: 'Portsmouth, New Hampshire, USA',
    website: 'https://www.bapcertification.org',
    description: 'Global Seafood Alliance certification covering environmental responsibility, social accountability, food safety, and animal welfare.',
    speciesCovered: ['Atlantic Salmon', 'Nile Tilapia', 'Pangasius (Basa)', 'Whiteleg Shrimp', 'Giant Tiger Prawn', 'Channel Catfish', 'Barramundi'],
    countriesActive: ['United States', 'China', 'Vietnam', 'Indonesia', 'India', 'Ecuador', 'Thailand', 'Norway', 'Chile', 'Honduras', 'Brazil', 'Bangladesh', 'Philippines', 'Turkey', 'Malaysia'],
    certifiedFarms: 3200,
    welfareCriteria: {
      stockingDensity: { covered: true, stringency: 0.6, details: 'Density guidelines per species' },
      stunning: { covered: true, stringency: 0.5, details: 'Encouraged but enforcement varies' },
      waterQuality: { covered: true, stringency: 0.7, details: 'Regular monitoring required' },
      handling: { covered: true, stringency: 0.5, details: 'Best practice guidelines' },
      enrichment: { covered: false, stringency: 0.0, details: 'Not required' },
      mortality: { covered: true, stringency: 0.6, details: 'Mortality tracking required' },
      antibioticUse: { covered: true, stringency: 0.8, details: 'Strict antibiotic use protocols' },
      slaughter: { covered: true, stringency: 0.5, details: 'Humane slaughter guidelines' }
    },
    overallStringencyScore: 0.58,
    welfareSpecificScore: 0.45,
    lastUpdated: '2024',
    color: '#0066CC'
  },
  {
    id: 'globalgap',
    name: 'GlobalGAP Aquaculture',
    abbreviation: 'GlobalGAP',
    type: 'Certification',
    founded: 1997,
    headquarters: 'Cologne, Germany',
    website: 'https://www.globalgap.org',
    description: 'International farm assurance standard with aquaculture module covering food safety, sustainability, and animal welfare.',
    speciesCovered: ['Atlantic Salmon', 'Rainbow Trout', 'Pangasius (Basa)', 'European Seabass', 'Gilthead Seabream'],
    countriesActive: ['Norway', 'Chile', 'Turkey', 'Greece', 'Spain', 'Vietnam', 'Italy', 'France', 'Germany', 'United Kingdom'],
    certifiedFarms: 850,
    welfareCriteria: {
      stockingDensity: { covered: true, stringency: 0.7, details: 'Species-specific density limits' },
      stunning: { covered: true, stringency: 0.7, details: 'Pre-slaughter stunning required' },
      waterQuality: { covered: true, stringency: 0.8, details: 'Comprehensive water quality monitoring' },
      handling: { covered: true, stringency: 0.7, details: 'Staff training required, handling minimization' },
      enrichment: { covered: false, stringency: 0.1, details: 'Minimal requirements' },
      mortality: { covered: true, stringency: 0.7, details: 'Detailed mortality recording' },
      antibioticUse: { covered: true, stringency: 0.7, details: 'Regulated use protocols' },
      slaughter: { covered: true, stringency: 0.7, details: 'Humane slaughter protocols' }
    },
    overallStringencyScore: 0.68,
    welfareSpecificScore: 0.58,
    lastUpdated: '2024',
    color: '#7AB800'
  },
  {
    id: 'rspca',
    name: 'RSPCA Assured',
    abbreviation: 'RSPCA Assured',
    type: 'Certification',
    founded: 1994,
    headquarters: 'West Sussex, United Kingdom',
    website: 'https://www.rspcaassured.org.uk',
    description: 'UK-focused welfare certification with the highest welfare standards for farmed fish. Gold standard for aquatic welfare.',
    speciesCovered: ['Atlantic Salmon', 'Rainbow Trout'],
    countriesActive: ['United Kingdom', 'Norway'],
    certifiedFarms: 120,
    welfareCriteria: {
      stockingDensity: { covered: true, stringency: 0.9, details: 'Strict lower density than other certifications' },
      stunning: { covered: true, stringency: 0.95, details: 'Effective stunning mandatory before slaughter - industry leading' },
      waterQuality: { covered: true, stringency: 0.9, details: 'Extensive monitoring and thresholds' },
      handling: { covered: true, stringency: 0.9, details: 'Detailed handling protocols, trained personnel required' },
      enrichment: { covered: true, stringency: 0.5, details: 'Some enrichment considerations - pioneering in industry' },
      mortality: { covered: true, stringency: 0.9, details: 'Very low mortality thresholds' },
      antibioticUse: { covered: true, stringency: 0.9, details: 'Highly restricted' },
      slaughter: { covered: true, stringency: 0.95, details: 'Most comprehensive humane slaughter requirements' }
    },
    overallStringencyScore: 0.90,
    welfareSpecificScore: 0.88,
    lastUpdated: '2024',
    color: '#E4002B'
  },
  {
    id: 'naturland',
    name: 'Naturland',
    abbreviation: 'Naturland',
    type: 'Certification',
    founded: 1982,
    headquarters: 'Gräfelfing, Germany',
    website: 'https://www.naturland.de',
    description: 'Organic certification with aquaculture standards. Strong environmental and welfare criteria.',
    speciesCovered: ['Rainbow Trout', 'Common Carp', 'Atlantic Salmon'],
    countriesActive: ['Germany', 'Austria', 'Denmark', 'Norway', 'Ireland'],
    certifiedFarms: 60,
    welfareCriteria: {
      stockingDensity: { covered: true, stringency: 0.85, details: 'Very low maximum densities' },
      stunning: { covered: true, stringency: 0.8, details: 'Stunning required' },
      waterQuality: { covered: true, stringency: 0.85, details: 'Natural water systems preferred' },
      handling: { covered: true, stringency: 0.8, details: 'Minimal handling protocols' },
      enrichment: { covered: true, stringency: 0.4, details: 'Natural environment preservation' },
      mortality: { covered: true, stringency: 0.8, details: 'Low mortality expectations' },
      antibioticUse: { covered: true, stringency: 0.95, details: 'Nearly zero antibiotic use required' },
      slaughter: { covered: true, stringency: 0.8, details: 'Humane slaughter required' }
    },
    overallStringencyScore: 0.82,
    welfareSpecificScore: 0.78,
    lastUpdated: '2024',
    color: '#006633'
  },
  {
    id: 'eu-organic',
    name: 'EU Organic Aquaculture',
    abbreviation: 'EU Organic',
    type: 'Regulation',
    founded: 2009,
    headquarters: 'Brussels, Belgium',
    website: 'https://agriculture.ec.europa.eu',
    description: 'EU regulatory framework for organic aquaculture production with welfare considerations.',
    speciesCovered: ['Atlantic Salmon', 'Rainbow Trout', 'Common Carp', 'European Seabass', 'Gilthead Seabream'],
    countriesActive: ['France', 'Germany', 'Italy', 'Spain', 'Greece', 'Ireland', 'Denmark', 'Norway', 'United Kingdom', 'Austria', 'Netherlands', 'Poland', 'Croatia'],
    certifiedFarms: 400,
    welfareCriteria: {
      stockingDensity: { covered: true, stringency: 0.75, details: 'Lower density than conventional' },
      stunning: { covered: true, stringency: 0.7, details: 'Humane killing required' },
      waterQuality: { covered: true, stringency: 0.8, details: 'Natural water quality maintenance' },
      handling: { covered: true, stringency: 0.6, details: 'Minimal handling guidelines' },
      enrichment: { covered: false, stringency: 0.2, details: 'Natural environment maintenance' },
      mortality: { covered: true, stringency: 0.6, details: 'General welfare indicators' },
      antibioticUse: { covered: true, stringency: 0.9, details: 'Severely restricted' },
      slaughter: { covered: true, stringency: 0.7, details: 'Humane slaughter required' }
    },
    overallStringencyScore: 0.72,
    welfareSpecificScore: 0.62,
    lastUpdated: '2024',
    color: '#4A90D9'
  },
  {
    id: 'fos',
    name: 'Friend of the Sea',
    abbreviation: 'FOS',
    type: 'Certification',
    founded: 2008,
    headquarters: 'Milan, Italy',
    website: 'https://friendofthesea.org',
    description: 'International sustainability certification for fisheries and aquaculture products.',
    speciesCovered: ['European Seabass', 'Gilthead Seabream', 'Atlantic Salmon', 'Nile Tilapia', 'Whiteleg Shrimp'],
    countriesActive: ['Turkey', 'Greece', 'Spain', 'Italy', 'Vietnam', 'Thailand', 'Norway', 'Chile'],
    certifiedFarms: 180,
    welfareCriteria: {
      stockingDensity: { covered: true, stringency: 0.5, details: 'Basic density requirements' },
      stunning: { covered: false, stringency: 0.2, details: 'Encouraged but not mandatory' },
      waterQuality: { covered: true, stringency: 0.6, details: 'Basic monitoring' },
      handling: { covered: true, stringency: 0.4, details: 'General guidelines' },
      enrichment: { covered: false, stringency: 0.0, details: 'Not covered' },
      mortality: { covered: true, stringency: 0.5, details: 'Basic reporting' },
      antibioticUse: { covered: true, stringency: 0.6, details: 'Guidelines on responsible use' },
      slaughter: { covered: false, stringency: 0.3, details: 'Basic humane slaughter encouraged' }
    },
    overallStringencyScore: 0.45,
    welfareSpecificScore: 0.30,
    lastUpdated: '2024',
    color: '#29ABE2'
  }
];

export function getStandardById(id) {
  return welfareStandards.find(s => s.id === id);
}

export function getStandardsForSpecies(speciesName) {
  return welfareStandards.filter(s => s.speciesCovered.includes(speciesName));
}

export function getStandardsInCountry(country) {
  return welfareStandards.filter(s => s.countriesActive.includes(country));
}

export function getAverageStringency() {
  return welfareStandards.reduce((sum, s) => sum + s.welfareSpecificScore, 0) / welfareStandards.length;
}
