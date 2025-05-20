import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const expenses = await prisma.expense.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(expenses);
}
