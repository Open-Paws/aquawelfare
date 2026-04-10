import { species } from '../../../data/species';
import { getTaxonomicGroups } from '../../../lib/species-utils';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
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
      const min = parseInt(minProduction, 10);
      if (!isNaN(min)) {
        result = result.filter(s => s.annualProductionTonnes >= min);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.commonName.toLowerCase().includes(q) ||
        s.scientificName.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      total: result.length,
      taxonomicGroups: getTaxonomicGroups(),
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
