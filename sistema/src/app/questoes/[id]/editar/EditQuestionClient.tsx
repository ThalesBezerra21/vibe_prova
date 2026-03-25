"use client";

import { QuestionOnlyForm, QuestionFormValues } from "@/components/QuestionOnlyForm";
import { updateQuestion } from "@/app/actions";
import { useRouter } from "next/navigation";

export function EditQuestionClient({ id, defaultValues }: { id: number, defaultValues: any }) {
  const router = useRouter();

  const handleSubmit = async (data: QuestionFormValues) => {
    const payload = {
        type: data.type,
        enunciado: data.enunciado,
        correctOptionId: data.correctOptionId,
        options: data.options.map(opt => ({ id: opt.uid, text: opt.text }))
    };
    
    await updateQuestion(id, payload);
    router.push(`/questoes`);
  };

  return (
    <QuestionOnlyForm
      title="Editar Questão"
      description="Faça as alterações na questão."
      submitLabel="Salvar Mudanças"
      defaultValues={defaultValues}
      onSubmitAction={handleSubmit}
    />
  );
}
