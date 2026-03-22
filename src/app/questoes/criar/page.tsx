"use client";

import { QuestionOnlyForm, QuestionFormValues } from "@/components/QuestionOnlyForm";
import { createQuestion } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function CriarQuestao() {
  const router = useRouter();

  const handleSubmit = async (data: QuestionFormValues) => {
    const payload = {
        type: data.type,
        enunciado: data.enunciado,
        correctOptionId: data.correctOptionId,
        options: data.options.map(opt => ({ id: opt.uid, text: opt.text }))
    };
    
    await createQuestion(payload);
    router.push("/questoes");
  };

  return (
    <QuestionOnlyForm
      title="Criar Nova Questão"
      description="Adicione a questão ao banco de dados."
      submitLabel="Salvar Questão"
      onSubmitAction={handleSubmit}
    />
  );
}
