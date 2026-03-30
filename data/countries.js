// Country-level aquaculture data
// Sources: FAO FishStatJ 2024, SOFIA 2024, national legislation reviews
// All production in tonnes (metric), latest available data (2022-2023)

export const countries = [
  {
    id: 'CN', name: 'China', region: 'East Asia', lat: 35.86, lng: 104.19,
    totalAquacultureProduction: 57470000,
    speciesFarmed: ['Grass Carp', 'Silver Carp', 'Common Carp', 'Bighead Carp', 'Crucian Carp', 'Nile Tilapia', 'Whiteleg Shrimp', 'Pacific Oyster', 'Manila Clam', 'Red Swamp Crayfish', 'Chinese Mitten Crab', 'Pangasius (Basa)', 'Largemouth Bass', 'Snakehead', 'Wuchang Bream'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No specific aquatic animal welfare legislation. Animal husbandry law does not cover fish or crustaceans.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 2,
    welfareScore: 0.08,
    keyIssues: ['Massive production with virtually no welfare coverage', 'Live animal markets standard practice', 'No stunning requirements', 'Extreme stocking densities in polyculture'],
    dataYear: 2023
  },
  {
    id: 'IN', name: 'India', region: 'South Asia', lat: 20.59, lng: 78.96,
    totalAquacultureProduction: 9800000,
    speciesFarmed: ['Rohu', 'Catla', 'Common Carp', 'Whiteleg Shrimp', 'Giant River Prawn', 'Nile Tilapia', 'Pangasius (Basa)'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Prevention of Cruelty to Animals Act 1960 exists but rarely applied to aquaculture. No specific fish welfare regulations.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 3,
    welfareScore: 0.10,
    keyIssues: ['Legislation exists but not enforced for aquatic animals', 'Traditional polyculture with no welfare considerations', 'Massive shrimp industry with eyestalk ablation'],
    dataYear: 2023
  },
  {
    id: 'ID', name: 'Indonesia', region: 'Southeast Asia', lat: -0.79, lng: 113.92,
    totalAquacultureProduction: 6500000,
    speciesFarmed: ['Whiteleg Shrimp', 'Nile Tilapia', 'Milkfish', 'Common Carp', 'Pangasius (Basa)', 'Giant Tiger Prawn'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No animal welfare legislation covering aquatic species.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 5,
    welfareScore: 0.12,
    keyIssues: ['Rapidly expanding shrimp industry', 'Mangrove destruction for ponds', 'No welfare framework for any species'],
    dataYear: 2023
  },
  {
    id: 'VN', name: 'Vietnam', region: 'Southeast Asia', lat: 14.06, lng: 108.28,
    totalAquacultureProduction: 4800000,
    speciesFarmed: ['Pangasius (Basa)', 'Whiteleg Shrimp', 'Giant Tiger Prawn', 'Nile Tilapia', 'Snakehead'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No animal welfare legislation. Fisheries Law 2017 covers aquaculture management but not welfare.' },
    activeCertifications: ['ASC', 'BAP', 'GlobalGAP'],
    certifiedProductionPercent: 12,
    welfareScore: 0.18,
    keyIssues: ['Major pangasius producer with extreme densities', 'Growing certification adoption', 'Shrimp eyestalk ablation standard'],
    dataYear: 2023
  },
  {
    id: 'BD', name: 'Bangladesh', region: 'South Asia', lat: 23.68, lng: 90.36,
    totalAquacultureProduction: 2700000,
    speciesFarmed: ['Rohu', 'Catla', 'Silver Carp', 'Nile Tilapia', 'Pangasius (Basa)', 'Whiteleg Shrimp', 'Giant Tiger Prawn', 'Giant River Prawn'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No animal welfare legislation covering aquaculture.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 2,
    welfareScore: 0.06,
    keyIssues: ['Massive smallholder production', 'Virtually no welfare monitoring', 'Shrimp farming in coastal areas'],
    dataYear: 2023
  },
  {
    id: 'NO', name: 'Norway', region: 'Northern Europe', lat: 60.47, lng: 8.47,
    totalAquacultureProduction: 1670000,
    speciesFarmed: ['Atlantic Salmon', 'Rainbow Trout', 'Atlantic Cod'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animal Welfare Act 2009 covers fish. Aquaculture Operations Regulations include welfare provisions. Pre-slaughter stunning required since 2022.' },
    activeCertifications: ['ASC', 'GlobalGAP', 'RSPCA Assured', 'Naturland', 'EU Organic'],
    certifiedProductionPercent: 75,
    welfareScore: 0.82,
    keyIssues: ['Industry leader in welfare', 'Sea lice treatments remain welfare concern', 'High mortality in some farms', 'Cleaner fish welfare issues'],
    dataYear: 2023
  },
  {
    id: 'CL', name: 'Chile', region: 'South America', lat: -35.68, lng: -71.54,
    totalAquacultureProduction: 1580000,
    speciesFarmed: ['Atlantic Salmon', 'Rainbow Trout', 'Whiteleg Shrimp'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Law No. 20.380 on Animal Protection (2009). Aquaculture regulations include some welfare provisions.' },
    activeCertifications: ['ASC', 'BAP', 'GlobalGAP'],
    certifiedProductionPercent: 55,
    welfareScore: 0.58,
    keyIssues: ['Second largest salmon producer', 'Disease outbreaks and antibiotic use', 'Improving stunning compliance'],
    dataYear: 2023
  },
  {
    id: 'EG', name: 'Egypt', region: 'North Africa', lat: 26.82, lng: 30.80,
    totalAquacultureProduction: 1800000,
    speciesFarmed: ['Nile Tilapia', 'European Seabass', 'Gilthead Seabream'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No specific animal welfare legislation for aquaculture.' },
    activeCertifications: ['ASC'],
    certifiedProductionPercent: 3,
    welfareScore: 0.10,
    keyIssues: ['Largest aquaculture producer in Africa', 'Intensive tilapia farming', 'No welfare standards enforcement'],
    dataYear: 2023
  },
  {
    id: 'EC', name: 'Ecuador', region: 'South America', lat: -1.83, lng: -78.18,
    totalAquacultureProduction: 1200000,
    speciesFarmed: ['Whiteleg Shrimp', 'Nile Tilapia'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No animal welfare legislation for aquatic species.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 20,
    welfareScore: 0.22,
    keyIssues: ['Top 4 global shrimp producer', 'Certification-driven improvements', 'Eyestalk ablation still prevalent'],
    dataYear: 2023
  },
  {
    id: 'TH', name: 'Thailand', region: 'Southeast Asia', lat: 15.87, lng: 100.99,
    totalAquacultureProduction: 960000,
    speciesFarmed: ['Whiteleg Shrimp', 'Nile Tilapia', 'Giant River Prawn', 'Barramundi'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Prevention of Animal Cruelty and Provision of Animal Welfare Act 2014. Limited application to aquaculture.' },
    activeCertifications: ['ASC', 'BAP', 'GlobalGAP'],
    certifiedProductionPercent: 15,
    welfareScore: 0.20,
    keyIssues: ['Historically major shrimp producer', 'Labor rights and welfare overlap', 'Growing certification adoption'],
    dataYear: 2023
  },
  {
    id: 'PH', name: 'Philippines', region: 'Southeast Asia', lat: 12.88, lng: 121.77,
    totalAquacultureProduction: 2400000,
    speciesFarmed: ['Milkfish', 'Nile Tilapia', 'Whiteleg Shrimp', 'Mud Crab'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Animal Welfare Act 1998. Application to aquaculture minimal.' },
    activeCertifications: ['ASC'],
    certifiedProductionPercent: 2,
    welfareScore: 0.08,
    keyIssues: ['Large milkfish industry', 'Wild-caught milkfish fry', 'Limited welfare awareness'],
    dataYear: 2023
  },
  {
    id: 'JP', name: 'Japan', region: 'East Asia', lat: 36.20, lng: 138.25,
    totalAquacultureProduction: 670000,
    speciesFarmed: ['Japanese Amberjack (Yellowtail)', 'Pacific Oyster', 'Yesso Scallop', 'Sea Cucumber'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'Act on Welfare and Management of Animals (1973, revised 2019) excludes fish. No aquatic welfare provisions.' },
    activeCertifications: ['ASC'],
    certifiedProductionPercent: 8,
    welfareScore: 0.15,
    keyIssues: ['Wild-caught juveniles for yellowtail farming', 'Cultural practices conflict with welfare standards', 'Growing consumer awareness'],
    dataYear: 2023
  },
  {
    id: 'MM', name: 'Myanmar', region: 'Southeast Asia', lat: 21.91, lng: 95.96,
    totalAquacultureProduction: 1200000,
    speciesFarmed: ['Rohu', 'Common Carp', 'Catla', 'Nile Tilapia', 'Whiteleg Shrimp'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No animal welfare legislation.' },
    activeCertifications: [],
    certifiedProductionPercent: 0,
    welfareScore: 0.02,
    keyIssues: ['No welfare framework whatsoever', 'Political instability limits regulatory development', 'Smallholder dominated'],
    dataYear: 2023
  },
  {
    id: 'GB', name: 'United Kingdom', region: 'Northern Europe', lat: 55.38, lng: -3.44,
    totalAquacultureProduction: 210000,
    speciesFarmed: ['Atlantic Salmon', 'Rainbow Trout'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animal Welfare Act 2006. Animal Welfare (Sentience) Act 2022 recognizes fish, decapods, and cephalopods as sentient. Welfare of Farmed Animals (England) Regulations 2007.' },
    activeCertifications: ['ASC', 'RSPCA Assured', 'GlobalGAP', 'Naturland'],
    certifiedProductionPercent: 85,
    welfareScore: 0.88,
    keyIssues: ['Global leader in aquatic welfare legislation', 'Sentience Act landmark legislation', 'High certification rates', 'RSPCA Assured setting gold standard'],
    dataYear: 2023
  },
  {
    id: 'TR', name: 'Turkey', region: 'Western Asia', lat: 38.96, lng: 35.24,
    totalAquacultureProduction: 470000,
    speciesFarmed: ['European Seabass', 'Gilthead Seabream', 'Rainbow Trout', 'Atlantic Salmon'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Animal Protection Law 5199 (2004). Limited enforcement for aquaculture. EU accession process driving improvements.' },
    activeCertifications: ['ASC', 'GlobalGAP', 'FOS'],
    certifiedProductionPercent: 30,
    welfareScore: 0.35,
    keyIssues: ['Largest European seabass producer', 'Growing certification', 'EU alignment pushing improvements'],
    dataYear: 2023
  },
  {
    id: 'GR', name: 'Greece', region: 'Southern Europe', lat: 39.07, lng: 21.82,
    totalAquacultureProduction: 145000,
    speciesFarmed: ['European Seabass', 'Gilthead Seabream'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'EU Directive 98/58/EC transposed. Council Regulation (EC) No 1099/2009 on killing. Greek animal welfare law.' },
    activeCertifications: ['ASC', 'GlobalGAP', 'FOS'],
    certifiedProductionPercent: 45,
    welfareScore: 0.50,
    keyIssues: ['EU welfare regulations applicable', 'Stunning adoption improving', 'Stocking density concerns persist'],
    dataYear: 2023
  },
  {
    id: 'ES', name: 'Spain', region: 'Southern Europe', lat: 40.46, lng: -3.75,
    totalAquacultureProduction: 350000,
    speciesFarmed: ['Gilthead Seabream', 'European Seabass', 'Rainbow Trout', 'Common Octopus'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'EU welfare directives apply. Royal Decree 53/2013 on animal experimentation and welfare. Proposed octopus farming facing backlash.' },
    activeCertifications: ['ASC', 'GlobalGAP', 'FOS'],
    certifiedProductionPercent: 35,
    welfareScore: 0.48,
    keyIssues: ['Octopus farming controversy (Nueva Pescanova)', 'EU welfare regulations', 'Growing welfare awareness'],
    dataYear: 2023
  },
  {
    id: 'US', name: 'United States', region: 'North America', lat: 37.09, lng: -95.71,
    totalAquacultureProduction: 480000,
    speciesFarmed: ['Channel Catfish', 'Atlantic Salmon', 'Rainbow Trout', 'Whiteleg Shrimp', 'Red Drum'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No federal aquatic animal welfare legislation. Animal Welfare Act explicitly excludes fish. Some state-level protections vary.' },
    activeCertifications: ['BAP', 'ASC'],
    certifiedProductionPercent: 35,
    welfareScore: 0.35,
    keyIssues: ['Federal law excludes fish from welfare protection', 'State-by-state variability', 'Industry-driven certification adoption', 'Growing advocacy pressure'],
    dataYear: 2023
  },
  {
    id: 'BR', name: 'Brazil', region: 'South America', lat: -14.24, lng: -51.93,
    totalAquacultureProduction: 860000,
    speciesFarmed: ['Nile Tilapia', 'Whiteleg Shrimp', 'Tambaqui'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Environmental crimes law (1998) covers animal cruelty. Limited application to aquaculture.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 8,
    welfareScore: 0.15,
    keyIssues: ['Rapidly growing tilapia industry', 'Amazon region tambaqui farming', 'Limited welfare enforcement'],
    dataYear: 2023
  },
  {
    id: 'KR', name: 'South Korea', region: 'East Asia', lat: 35.91, lng: 127.77,
    totalAquacultureProduction: 650000,
    speciesFarmed: ['Pacific Oyster', 'Manila Clam', 'Yesso Scallop', 'Swimming Crab', 'Abalone'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Animal Protection Act (2007, revised 2017). Fish excluded from most provisions.' },
    activeCertifications: ['ASC'],
    certifiedProductionPercent: 5,
    welfareScore: 0.18,
    keyIssues: ['Major shellfish producer', 'Live fish market culture', 'Limited enforcement for aquatic species'],
    dataYear: 2023
  },
  {
    id: 'TW', name: 'Taiwan', region: 'East Asia', lat: 23.70, lng: 120.96,
    totalAquacultureProduction: 280000,
    speciesFarmed: ['Milkfish', 'Nile Tilapia', 'Whiteleg Shrimp'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Animal Protection Act (1998). Fish partially covered but enforcement limited.' },
    activeCertifications: ['ASC'],
    certifiedProductionPercent: 5,
    welfareScore: 0.20,
    keyIssues: ['Pioneer in milkfish aquaculture', 'Some legislative coverage', 'Cultural live fish market practices'],
    dataYear: 2023
  },
  {
    id: 'IR', name: 'Iran', region: 'Western Asia', lat: 32.43, lng: 53.69,
    totalAquacultureProduction: 540000,
    speciesFarmed: ['Rainbow Trout', 'Common Carp'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No specific animal welfare legislation for aquaculture.' },
    activeCertifications: [],
    certifiedProductionPercent: 0,
    welfareScore: 0.05,
    keyIssues: ['Top rainbow trout producer globally', 'No welfare framework', 'Traditional production methods'],
    dataYear: 2023
  },
  {
    id: 'IT', name: 'Italy', region: 'Southern Europe', lat: 41.87, lng: 12.57,
    totalAquacultureProduction: 120000,
    speciesFarmed: ['Rainbow Trout', 'European Seabass', 'Gilthead Seabream', 'Manila Clam'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'EU welfare regulations fully transposed. National legislation on animal welfare.' },
    activeCertifications: ['ASC', 'GlobalGAP', 'EU Organic'],
    certifiedProductionPercent: 40,
    welfareScore: 0.55,
    keyIssues: ['EU regulations provide baseline', 'Strong certification presence', 'Traditional aquaculture sector'],
    dataYear: 2023
  },
  {
    id: 'CA', name: 'Canada', region: 'North America', lat: 56.13, lng: -106.35,
    totalAquacultureProduction: 210000,
    speciesFarmed: ['Atlantic Salmon', 'Rainbow Trout'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'National Farmed Animal Care Council codes of practice. British Columbia has aquaculture regulations with welfare components.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 60,
    welfareScore: 0.65,
    keyIssues: ['Growing welfare framework', 'BC salmon farming controversies', 'Transitioning to closed containment'],
    dataYear: 2023
  },
  {
    id: 'AU', name: 'Australia', region: 'Oceania', lat: -25.27, lng: 133.78,
    totalAquacultureProduction: 110000,
    speciesFarmed: ['Atlantic Salmon', 'Barramundi', 'Whiteleg Shrimp', 'Abalone'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'State-level animal welfare acts cover fish (e.g., Prevention of Cruelty to Animals Act). Codes of practice for aquaculture.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 50,
    welfareScore: 0.62,
    keyIssues: ['State-level welfare variation', 'Growing barramundi sector', 'Active welfare research community'],
    dataYear: 2023
  },
  {
    id: 'DK', name: 'Denmark', region: 'Northern Europe', lat: 56.26, lng: 9.50,
    totalAquacultureProduction: 38000,
    speciesFarmed: ['Rainbow Trout', 'Atlantic Salmon'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Danish Animal Welfare Act covers fish. Pre-slaughter stunning mandatory. Strong enforcement.' },
    activeCertifications: ['ASC', 'GlobalGAP', 'Naturland', 'EU Organic'],
    certifiedProductionPercent: 80,
    welfareScore: 0.85,
    keyIssues: ['Progressive welfare legislation', 'RAS technology leadership', 'Small but high-welfare production'],
    dataYear: 2023
  },
  {
    id: 'IS', name: 'Iceland', region: 'Northern Europe', lat: 64.96, lng: -19.02,
    totalAquacultureProduction: 52000,
    speciesFarmed: ['Atlantic Salmon', 'Atlantic Cod', 'Arctic Char'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animal Welfare Act 2013 covers fish. Aquaculture Act with welfare provisions.' },
    activeCertifications: ['ASC'],
    certifiedProductionPercent: 70,
    welfareScore: 0.78,
    keyIssues: ['Growing salmon farming sector', 'Cold water welfare advantages', 'Strong regulatory framework'],
    dataYear: 2023
  },
  {
    id: 'FO', name: 'Faroe Islands', region: 'Northern Europe', lat: 61.89, lng: -6.91,
    totalAquacultureProduction: 92000,
    speciesFarmed: ['Atlantic Salmon'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Faroese animal welfare legislation covers fish. Aquaculture regulations include welfare.' },
    activeCertifications: ['ASC', 'GlobalGAP'],
    certifiedProductionPercent: 90,
    welfareScore: 0.80,
    keyIssues: ['Very high certification rate', 'Exposure to severe weather', 'Small but well-managed sector'],
    dataYear: 2023
  },
  {
    id: 'NP', name: 'Nepal', region: 'South Asia', lat: 28.39, lng: 84.12,
    totalAquacultureProduction: 110000,
    speciesFarmed: ['Rohu', 'Catla', 'Silver Carp', 'Common Carp'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No animal welfare legislation for aquaculture.' },
    activeCertifications: [],
    certifiedProductionPercent: 0,
    welfareScore: 0.03,
    keyIssues: ['Smallholder pond culture', 'No welfare infrastructure', 'Traditional practices'],
    dataYear: 2023
  },
  {
    id: 'PK', name: 'Pakistan', region: 'South Asia', lat: 30.38, lng: 69.35,
    totalAquacultureProduction: 210000,
    speciesFarmed: ['Rohu', 'Catla', 'Grass Carp', 'Silver Carp'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'Prevention of Cruelty to Animals Act 1890 (colonial era). Not applied to fish.' },
    activeCertifications: [],
    certifiedProductionPercent: 0,
    welfareScore: 0.03,
    keyIssues: ['Outdated legislation', 'No enforcement', 'Growing aquaculture with no welfare framework'],
    dataYear: 2023
  },
  {
    id: 'MX', name: 'Mexico', region: 'Central America', lat: 23.63, lng: -102.55,
    totalAquacultureProduction: 420000,
    speciesFarmed: ['Whiteleg Shrimp', 'Nile Tilapia', 'Rainbow Trout'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Federal Animal Protection Law. Limited aquaculture application.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 10,
    welfareScore: 0.15,
    keyIssues: ['Major shrimp producer', 'Growing tilapia sector', 'Certification expanding'],
    dataYear: 2023
  },
  {
    id: 'HN', name: 'Honduras', region: 'Central America', lat: 15.20, lng: -86.24,
    totalAquacultureProduction: 65000,
    speciesFarmed: ['Whiteleg Shrimp', 'Nile Tilapia'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No specific animal welfare legislation for aquaculture.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 25,
    welfareScore: 0.22,
    keyIssues: ['Export-oriented shrimp farming', 'Certification driven by market access'],
    dataYear: 2023
  },
  {
    id: 'ZA', name: 'South Africa', region: 'Sub-Saharan Africa', lat: -30.56, lng: 22.94,
    totalAquacultureProduction: 8000,
    speciesFarmed: ['Abalone', 'Rainbow Trout', 'Nile Tilapia'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animals Protection Act 1962. National Environmental Management: Biodiversity Act covers some aspects.' },
    activeCertifications: ['ASC'],
    certifiedProductionPercent: 40,
    welfareScore: 0.45,
    keyIssues: ['Small but growing sector', 'Abalone farming relatively well-managed', 'Water scarcity challenges'],
    dataYear: 2023
  },
  {
    id: 'IE', name: 'Ireland', region: 'Northern Europe', lat: 53.14, lng: -7.69,
    totalAquacultureProduction: 42000,
    speciesFarmed: ['Atlantic Salmon', 'Pacific Oyster', 'Blue Mussel'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animal Health and Welfare Act 2013 covers fish. EU welfare directives transposed.' },
    activeCertifications: ['ASC', 'EU Organic', 'Naturland'],
    certifiedProductionPercent: 65,
    welfareScore: 0.72,
    keyIssues: ['Strong EU-aligned welfare framework', 'Organic salmon production', 'Environmental concerns in some locations'],
    dataYear: 2023
  },
  {
    id: 'FR', name: 'France', region: 'Western Europe', lat: 46.23, lng: 2.21,
    totalAquacultureProduction: 195000,
    speciesFarmed: ['Pacific Oyster', 'Rainbow Trout', 'European Seabass'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Rural Code includes animal welfare. EU regulations transposed. Recognition of animal sentience in Civil Code since 2015.' },
    activeCertifications: ['ASC', 'EU Organic', 'GlobalGAP'],
    certifiedProductionPercent: 45,
    welfareScore: 0.60,
    keyIssues: ['Strong legal recognition of animal sentience', 'Major oyster producer', 'Active welfare research'],
    dataYear: 2023
  },
  {
    id: 'NL', name: 'Netherlands', region: 'Western Europe', lat: 52.13, lng: 5.29,
    totalAquacultureProduction: 42000,
    speciesFarmed: ['Blue Mussel', 'European Eel'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animals Act (Wet dieren) 2011. Among strongest welfare frameworks globally. Fish explicitly covered.' },
    activeCertifications: ['ASC'],
    certifiedProductionPercent: 55,
    welfareScore: 0.75,
    keyIssues: ['Progressive welfare legislation', 'Eel farming welfare questions', 'Small but regulated sector'],
    dataYear: 2023
  },
  {
    id: 'DE', name: 'Germany', region: 'Western Europe', lat: 51.17, lng: 10.45,
    totalAquacultureProduction: 18000,
    speciesFarmed: ['Rainbow Trout', 'Common Carp'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animal Welfare Act (Tierschutzgesetz). Constitutional protection of animal welfare (Article 20a). Fish welfare explicitly covered.' },
    activeCertifications: ['Naturland', 'EU Organic', 'GlobalGAP', 'ASC'],
    certifiedProductionPercent: 60,
    welfareScore: 0.82,
    keyIssues: ['Constitutional protection unique globally', 'Strong enforcement', 'Small production but high standards'],
    dataYear: 2023
  },
  {
    id: 'AT', name: 'Austria', region: 'Western Europe', lat: 47.52, lng: 14.55,
    totalAquacultureProduction: 4200,
    speciesFarmed: ['Rainbow Trout', 'Common Carp'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Federal Animal Welfare Act 2004. Among the strongest globally. Ban on certain farming practices.' },
    activeCertifications: ['Naturland', 'EU Organic'],
    certifiedProductionPercent: 55,
    welfareScore: 0.85,
    keyIssues: ['One of the strongest welfare frameworks', 'Very small production', 'Traditional carp farming'],
    dataYear: 2023
  },
  {
    id: 'SE', name: 'Sweden', region: 'Northern Europe', lat: 60.13, lng: 18.64,
    totalAquacultureProduction: 15000,
    speciesFarmed: ['Rainbow Trout', 'Atlantic Salmon'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animal Welfare Act 2018. Strong fish welfare provisions. Pre-slaughter stunning mandatory.' },
    activeCertifications: ['ASC', 'EU Organic'],
    certifiedProductionPercent: 70,
    welfareScore: 0.83,
    keyIssues: ['Progressive welfare legislation', 'Small but high-welfare production', 'RAS technology adoption'],
    dataYear: 2023
  },
  {
    id: 'CH', name: 'Switzerland', region: 'Western Europe', lat: 46.82, lng: 8.23,
    totalAquacultureProduction: 2000,
    speciesFarmed: ['Rainbow Trout'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animal Welfare Act 2005 and Ordinance 2008. Among strongest globally. Fish welfare extensively covered. Pain in fish explicitly recognized.' },
    activeCertifications: ['Naturland'],
    certifiedProductionPercent: 65,
    welfareScore: 0.92,
    keyIssues: ['Arguably the strongest welfare legislation globally for fish', 'Very small production', 'Pain in fish legally recognized'],
    dataYear: 2023
  },
  {
    id: 'PL', name: 'Poland', region: 'Eastern Europe', lat: 51.92, lng: 19.15,
    totalAquacultureProduction: 38000,
    speciesFarmed: ['Common Carp', 'Rainbow Trout'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Animal Protection Act 1997. EU directives transposed. Enforcement limited for aquaculture.' },
    activeCertifications: ['EU Organic'],
    certifiedProductionPercent: 10,
    welfareScore: 0.35,
    keyIssues: ['Traditional carp farming', 'Christmas carp welfare controversy', 'EU regulations improving baseline'],
    dataYear: 2023
  },
  {
    id: 'HR', name: 'Croatia', region: 'Southern Europe', lat: 45.10, lng: 15.20,
    totalAquacultureProduction: 20000,
    speciesFarmed: ['European Seabass', 'Gilthead Seabream', 'Blue Mussel'],
    regulatoryFramework: { hasLegislation: true, enforced: true, details: 'Animal Protection Act 2006. EU acquis fully transposed.' },
    activeCertifications: ['ASC', 'EU Organic'],
    certifiedProductionPercent: 25,
    welfareScore: 0.48,
    keyIssues: ['EU-aligned welfare framework', 'Mediterranean aquaculture', 'Growing sector'],
    dataYear: 2023
  },
  {
    id: 'MY', name: 'Malaysia', region: 'Southeast Asia', lat: 4.21, lng: 101.98,
    totalAquacultureProduction: 420000,
    speciesFarmed: ['Whiteleg Shrimp', 'Barramundi', 'Nile Tilapia'],
    regulatoryFramework: { hasLegislation: true, enforced: false, details: 'Animal Welfare Act 2015. Application to aquaculture limited.' },
    activeCertifications: ['ASC', 'BAP'],
    certifiedProductionPercent: 5,
    welfareScore: 0.12,
    keyIssues: ['Growing shrimp industry', 'Legislation exists but unenforced for aquaculture', 'Export market driving some improvements'],
    dataYear: 2023
  },
  {
    id: 'TN', name: 'Tunisia', region: 'North Africa', lat: 33.89, lng: 9.54,
    totalAquacultureProduction: 25000,
    speciesFarmed: ['Gilthead Seabream', 'European Seabass'],
    regulatoryFramework: { hasLegislation: false, enforced: false, details: 'No specific animal welfare legislation for aquaculture.' },
    activeCertifications: [],
    certifiedProductionPercent: 0,
    welfareScore: 0.08,
    keyIssues: ['Growing Mediterranean aquaculture', 'No welfare framework', 'EU export requirements driving some practices'],
    dataYear: 2023
  }
];

export const regions = [
  'East Asia', 'South Asia', 'Southeast Asia', 'Northern Europe',
  'Southern Europe', 'Western Europe', 'Eastern Europe', 'North America',
  'South America', 'Central America', 'Oceania', 'North Africa',
  'Sub-Saharan Africa', 'Western Asia'
];

export function getCountryById(id) {
  return countries.find(c => c.id === id);
}

export function getCountriesByRegion(region) {
  return countries.filter(c => c.region === region);
}

export function getCountriesWithLegislation() {
  return countries.filter(c => c.regulatoryFramework.hasLegislation);
}

export function getCountriesWithoutLegislation() {
  return countries.filter(c => !c.regulatoryFramework.hasLegislation);
}
