"use server";

import { db } from "@/db";
import { provas, questions, provaQuestions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

export async function createProva(formData: {
  title: string;
  description: string;
  questions: {
    id?: number; 
    type?: 'single_choice' | 'multiple_choice' | 'sum_choice';
    enunciado: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  const result = await db.insert(provas).values({
    userId: user.id,
    title: formData.title,
    description: formData.description,
  }).returning({ id: provas.id });

  const provaId = result[0].id;

  for (let i = 0; i < formData.questions.length; i++) {
    const q = formData.questions[i];
    let questionId = q.id;

    if (!questionId) {
      const qResult = await db.insert(questions).values({
        userId: user.id,
        type: q.type,
        enunciado: q.enunciado,
        options: q.options,
        correctOptionId: q.correctOptionId,
      }).returning({ id: questions.id });
      questionId = qResult[0].id;
    }

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
    type?: 'single_choice' | 'multiple_choice' | 'sum_choice';
    enunciado: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  const [existingProva] = await db.select().from(provas).where(and(eq(provas.id, provaId), eq(provas.userId, user.id)));
  if (!existingProva) throw new Error("Prova não encontrada ou não autorizada");

  await db.update(provas).set({
    title: formData.title,
    description: formData.description,
  }).where(and(eq(provas.id, provaId), eq(provas.userId, user.id)));

  await db.delete(provaQuestions).where(eq(provaQuestions.provaId, provaId));

  for (let i = 0; i < formData.questions.length; i++) {
    const q = formData.questions[i];
    let questionId = q.id;

    if (!questionId) {
      const qResult = await db.insert(questions).values({
        userId: user.id,
        type: q.type,
        enunciado: q.enunciado,
        options: q.options,
        correctOptionId: q.correctOptionId,
      }).returning({ id: questions.id });
      questionId = qResult[0].id;
    } else {
      await db.update(questions).set({
        type: q.type,
        enunciado: q.enunciado,
        options: q.options,
        correctOptionId: q.correctOptionId,
      }).where(and(eq(questions.id, questionId), eq(questions.userId, user.id)));
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
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  await db.delete(provas).where(and(eq(provas.id, provaId), eq(provas.userId, user.id)));
  revalidatePath("/provas");
  return { success: true };
}

export async function createQuestion(formData: {
  type?: 'single_choice' | 'multiple_choice' | 'sum_choice';
  enunciado: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  await db.insert(questions).values({
    ...formData,
    userId: user.id,
  });
  revalidatePath("/questoes");
  return { success: true };
}

export async function updateQuestion(id: number, formData: {
  type?: 'single_choice' | 'multiple_choice' | 'sum_choice';
  enunciado: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  await db.update(questions).set(formData).where(and(eq(questions.id, id), eq(questions.userId, user.id)));
  
  revalidatePath("/questoes");
  revalidatePath("/provas");
  return { success: true };
}

export async function deleteQuestion(id: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  await db.delete(questions).where(and(eq(questions.id, id), eq(questions.userId, user.id)));
  revalidatePath("/questoes");
  revalidatePath("/provas");
  return { success: true };
}

export async function getQuestions() {
  const user = await getCurrentUser();
  if (!user) return [];

  const result = await db.select().from(questions).where(eq(questions.userId, user.id));
  return result.map(q => {
    let parsedOptions: { id: string; text: string }[] = [];
    if (typeof q.options === 'string') {
        try { parsedOptions = JSON.parse(q.options) } catch(e){}
    } else if (Array.isArray(q.options)) {
        parsedOptions = q.options as { id: string; text: string }[];
    }
    return {
      id: q.id,
      type: q.type,
      enunciado: q.enunciado,
      options: parsedOptions,
      correctOptionId: q.correctOptionId
    };
  });
}
