"use server";

import { db } from "@/db";
import { provas, questions } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createProva(formData: {
  title: string;
  description: string;
  questions: {
    enunciado: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
}) {
  const result = await db.insert(provas).values({
    title: formData.title,
    description: formData.description,
  }).returning({ id: provas.id });

  const provaId = result[0].id;

  const questionsToInsert = formData.questions.map(({ id, ...q }: any) => ({
    ...q,
    provaId,
  }));

  if (questionsToInsert.length > 0) {
    await db.insert(questions).values(questionsToInsert);
  }

  revalidatePath("/provas");
  return { success: true, provaId };
}

export async function deleteProva(provaId: number) {
  const { eq } = await import("drizzle-orm");
  await db.delete(provas).where(eq(provas.id, provaId));
  revalidatePath("/provas");
  return { success: true };
}

export async function updateProva(provaId: number, formData: {
  title: string;
  description: string;
  questions: {
    enunciado: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
}) {
  const { eq } = await import("drizzle-orm");

  await db.update(provas).set({
    title: formData.title,
    description: formData.description,
  }).where(eq(provas.id, provaId));

  // For simplicity: delete existing questions and recreate
  await db.delete(questions).where(eq(questions.provaId, provaId));

  const questionsToInsert = formData.questions.map(({ id, ...q }: any) => ({
    ...q,
    provaId,
  }));

  if (questionsToInsert.length > 0) {
    await db.insert(questions).values(questionsToInsert);
  }

  revalidatePath(`/provas/${provaId}`);
  revalidatePath("/provas");
  return { success: true, provaId };
}
