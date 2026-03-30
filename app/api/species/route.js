import { species, getSpeciesByGroup, getSpeciesByCountry, getTaxonomicGroups } from '../../../data/species';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const taxonomicGroup = searchParams.get('taxonomicGroup');
  const country = searchParams.get('country');
  const minProduction = searchParams.get('minProduction');
  const search = searchParams.get('search');
  
  let result = [...species];
  
  if (taxonomicGroup && taxonomicGroup !== 'All') {
    result = result.filter(s => s.taxonomicGroup === taxonomicGroup);
  }
  
  if (country) {
    result = result.filter(s => s.topProducers.includes(country));
  }
  
  if (minProduction) {
    result = result.filter(s => s.annualProductionTonnes >= parseInt(minProduction));
  }
  
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => 
      s.commonName.toLowerCase().includes(q) || 
      s.scientificName.toLowerCase().includes(q)
    );
  }
  
  return NextResponse.json({
    total: result.length,
    taxonomicGroups: getTaxonomicGroups(),
    data: result
  });
}
