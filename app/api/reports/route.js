import { generateReport } from '../../../lib/report-generator';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const filters = await request.json();
    const report = generateReport(filters);
    
    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      filters,
      report
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const report = generateReport({});
  return NextResponse.json({
    success: true,
    generatedAt: new Date().toISOString(),
    report
  });
}
