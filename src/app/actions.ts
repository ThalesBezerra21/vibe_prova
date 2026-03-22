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

  const questionsToInsert = formData.questions.map((q) => ({
    ...q,
    provaId,
  }));

  if (questionsToInsert.length > 0) {
    await db.insert(questions).values(questionsToInsert);
  }

  revalidatePath("/provas");
  return { success: true, provaId };
}
