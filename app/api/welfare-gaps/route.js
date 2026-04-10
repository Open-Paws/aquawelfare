import { calculateAllGapScores, calculateCountryGapScores, getGapSummaryStats } from '../../../lib/gap-scoring';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'species';
    const taxonomicGroup = searchParams.get('taxonomicGroup');
    const region = searchParams.get('region');
    const priority = searchParams.get('priority');

    let data;

    if (type === 'countries') {
      data = calculateCountryGapScores();
      if (region && region !== 'All') {
        data = data.filter(d => d.region === region);
      }
    } else {
      data = calculateAllGapScores();
      if (taxonomicGroup && taxonomicGroup !== 'All') {
        data = data.filter(d => d.taxonomicGroup === taxonomicGroup);
      }
    }

    if (priority && priority !== 'All') {
      data = data.filter(d => d.priorityLevel === priority);
    }

    const stats = getGapSummaryStats();

    return NextResponse.json({
      success: true,
      total: data.length,
      stats,
      data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
