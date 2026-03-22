import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditQuestionClient } from "./EditQuestionClient";

export default async function EditarQuestao({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const idStr = resolvedParams.id;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    notFound();
  }

  const result = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);

  if (result.length === 0) {
    notFound();
  }

  const q = result[0];

  let parsedOptions: { id: string; text: string }[] = [];
  if (typeof q.options === 'string') {
      try { parsedOptions = JSON.parse(q.options) } catch(e){}
  } else if (Array.isArray(q.options)) {
      parsedOptions = q.options as { id: string; text: string }[];
  }

  const defaultValues = {
    type: q.type,
    enunciado: q.enunciado,
    options: parsedOptions.map(opt => ({ uid: opt.id, text: opt.text })),
    correctOptionId: q.correctOptionId,
  };

  return <EditQuestionClient id={id} defaultValues={defaultValues} />;
}
