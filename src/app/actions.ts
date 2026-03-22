"use server";

import { db } from "@/db";
import { provas, questions, provaQuestions } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createProva(formData: {
  title: string;
  description: string;
  questions: {
    id?: number; // optional logic for re-use
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

  for (let i = 0; i < formData.questions.length; i++) {
    const q = formData.questions[i];
    let questionId = q.id;

    if (!questionId) {
      // Create new question
      const qResult = await db.insert(questions).values({
        enunciado: q.enunciado,
        options: q.options,
        correctOptionId: q.correctOptionId,
      }).returning({ id: questions.id });
      questionId = qResult[0].id;
    }

    // Link it
    await db.insert(provaQuestions).values({
      provaId,
      questionId,
      orderIndex: i,
    });
  }

  revalidatePath("/provas");
  revalidatePath("/questoes");
  return { success: true, provaId };
}

export async function updateProva(provaId: number, formData: {
  title: string;
  description: string;
  questions: {
    id?: number;
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

  // Delete old links
  await db.delete(provaQuestions).where(eq(provaQuestions.provaId, provaId));

  // Insert new links (+ questions if new)
  for (let i = 0; i < formData.questions.length; i++) {
    const q = formData.questions[i];
    let questionId = q.id;

    if (!questionId) {
      const qResult = await db.insert(questions).values({
        enunciado: q.enunciado,
        options: q.options,
        correctOptionId: q.correctOptionId,
      }).returning({ id: questions.id });
      questionId = qResult[0].id;
    } else {
      // Potentially update the question if edited from the form
      // Since "cada questão salva individualmente", we can update it.
      await db.update(questions).set({
        enunciado: q.enunciado,
        options: q.options,
        correctOptionId: q.correctOptionId,
      }).where(eq(questions.id, questionId));
    }

    await db.insert(provaQuestions).values({
      provaId,
      questionId,
      orderIndex: i,
    });
  }

  revalidatePath(`/provas/${provaId}`);
  revalidatePath("/provas");
  revalidatePath("/questoes");
  return { success: true, provaId };
}

export async function deleteProva(provaId: number) {
  const { eq } = await import("drizzle-orm");
  await db.delete(provas).where(eq(provas.id, provaId));
  revalidatePath("/provas");
  return { success: true };
}

export async function createQuestion(formData: {
  enunciado: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}) {
  await db.insert(questions).values(formData);
  revalidatePath("/questoes");
  return { success: true };
}

export async function updateQuestion(id: number, formData: {
  enunciado: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}) {
  const { eq } = await import("drizzle-orm");
  await db.update(questions).set(formData).where(eq(questions.id, id));
  
  // Revalidate related provas if needed, here just revalidate all generic
  revalidatePath("/questoes");
  revalidatePath("/provas");
  return { success: true };
}

export async function deleteQuestion(id: number) {
  const { eq } = await import("drizzle-orm");
  await db.delete(questions).where(eq(questions.id, id));
  revalidatePath("/questoes");
  revalidatePath("/provas");
  return { success: true };
}

export async function getQuestions() {
  const result = await db.select().from(questions);
  return result.map(q => {
    let parsedOptions: { id: string; text: string }[] = [];
    if (typeof q.options === 'string') {
        try { parsedOptions = JSON.parse(q.options) } catch(e){}
    } else if (Array.isArray(q.options)) {
        parsedOptions = q.options as { id: string; text: string }[];
    }
    return {
      id: q.id,
      enunciado: q.enunciado,
      options: parsedOptions,
      correctOptionId: q.correctOptionId
    };
  });
}
