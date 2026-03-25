"use client";

import { ProvaForm, FormValues } from "@/components/ProvaForm";
import { createProva } from "../actions";
import { useRouter } from "next/navigation";

export default function CriarProva() {
  const router = useRouter();

  const handleSubmit = async (data: FormValues) => {
    // Adapter options
    const payload = {
        ...data,
        questions: data.questions.map(q => ({
            ...q,
            options: q.options.map(opt => ({ id: opt.uid, text: opt.text }))
        }))
    };
    
    await createProva(payload);
    router.push("/provas");
  };

  return (
    <ProvaForm
      title="Criar Nova Prova"
      description="Adicione os detalhes da prova e suas questões."
      submitLabel="Salvar Prova"
      onSubmitAction={handleSubmit}
    />
  );
}
