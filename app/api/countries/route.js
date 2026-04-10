import { countries, regions } from '../../../data/countries';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const hasLegislation = searchParams.get('hasLegislation');
    const minProduction = searchParams.get('minProduction');

    let result = [...countries];

    if (region && region !== 'All') {
      result = result.filter(c => c.region === region);
    }

    if (hasLegislation !== null) {
      if (hasLegislation !== 'true' && hasLegislation !== 'false') {
        return NextResponse.json(
          { success: false, error: 'Invalid hasLegislation value. Must be "true" or "false".' },
          { status: 400 }
        );
      }
      result = result.filter(c => c.regulatoryFramework.hasLegislation === (hasLegislation === 'true'));
    }

    if (minProduction) {
      const min = parseInt(minProduction, 10);
      if (!isNaN(min)) {
        result = result.filter(c => c.totalAquacultureProduction >= min);
      }
    }

    return NextResponse.json({
      success: true,
      total: result.length,
      regions,
      data: result
    });
  } catch (error) {
    console.error('Countries API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
