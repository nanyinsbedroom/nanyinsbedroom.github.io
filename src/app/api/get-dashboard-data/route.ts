import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/data-fetching';

/**
 * API route handler for client-side data refreshing.
 * It re-fetches all data from the source repository.
 */
export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}