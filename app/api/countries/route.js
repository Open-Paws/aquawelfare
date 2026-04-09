import { countries, regions } from '../../../data/countries';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const hasLegislation = searchParams.get('hasLegislation');
  const minProduction = searchParams.get('minProduction');
  
  let result = [...countries];
  
  if (region && region !== 'All') {
    result = result.filter(c => c.region === region);
  }
  
  if (hasLegislation !== null && hasLegislation !== undefined) {
    result = result.filter(c => c.regulatoryFramework.hasLegislation === (hasLegislation === 'true'));
  }
  
  if (minProduction) {
    result = result.filter(c => c.totalAquacultureProduction >= parseInt(minProduction));
  }
  
  return NextResponse.json({
    total: result.length,
    regions,
    data: result
  });
}
