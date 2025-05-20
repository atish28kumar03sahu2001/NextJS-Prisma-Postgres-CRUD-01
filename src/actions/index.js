'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addExpense(formData) {
  const name = formData.get('name');
  const price = parseFloat(formData.get('price'));
  const description = formData.get('description');
  const date = formData.get('date');

  await prisma.expense.create({
    data: {
      expName: name,
      expPrice: price,
      expDesc: description,
      expDate: new Date(date),
    },
  });

  revalidatePath('/');
}

export async function updateExpense(formData) {
  const id = formData.get('id');
  const name = formData.get('name');
  const price = parseFloat(formData.get('price'));
  const description = formData.get('description');
  const date = formData.get('date');

  await prisma.expense.update({
    where: { id },
    data: {
      expName: name,
      expPrice: price,
      expDesc: description,
      expDate: new Date(date),
    },
  });

  revalidatePath('/');
}

export async function deleteExpense(formData) {
  const id = formData.get('id');

  if (!id) {
    throw new Error('No ID provided for deletion.');
  }

  const existing = await prisma.expense.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`Expense with ID ${id} does not exist.`);
  }

  await prisma.expense.delete({
    where: { id },
  });

  revalidatePath('/');
}

export async function fetchExpenses() {
  const expenses = await prisma.expense.findMany({ orderBy: { createdAt: 'desc' } });

  return expenses.map(exp => ({
    ...exp,
    expDate: exp.expDate.toISOString(),
  }));
}