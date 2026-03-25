import { db } from "@/db";
import { provas, questions, provaQuestions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { EditProvaClient } from "./EditProvaClient";
import { getCurrentUser } from "@/lib/auth";

export default async function EditarProva({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const resolvedParams = await params;
  const idStr = resolvedParams.id;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    notFound();
  }

  const result = await db
    .select()
    .from(provas)
    .where(and(eq(provas.id, id), eq(provas.userId, user.id)))
    .limit(1);

  if (result.length === 0) {
    notFound();
  }

  const prova = result[0];

  const provaQuestionsList = await db
    .select({
      id: questions.id,
      type: questions.type,
      enunciado: questions.enunciado,
      options: questions.options,
      correctOptionId: questions.correctOptionId,
    })
    .from(questions)
    .innerJoin(provaQuestions, eq(questions.id, provaQuestions.questionId))
    .where(eq(provaQuestions.provaId, prova.id));

  const parsedQuestions = provaQuestionsList.map((q) => {
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
      options: parsedOptions.map(opt => ({ uid: opt.id, text: opt.text })),
      correctOptionId: q.correctOptionId,
    };
  });

  const defaultValues = {
    title: prova.title,
    description: prova.description || "",
    questions: parsedQuestions,
  };

  return <EditProvaClient id={id} defaultValues={defaultValues} />;
}
