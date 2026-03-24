// GET /api/audits - Fetch all audit history
// Returns array of audits sorted by most recent first

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const audits = await prisma.audit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(audits);
  } catch (error) {
    console.error('Fetch audits error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}
