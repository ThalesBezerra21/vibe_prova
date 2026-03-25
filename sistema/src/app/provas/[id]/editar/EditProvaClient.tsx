"use client";

import { ProvaForm, FormValues } from "@/components/ProvaForm";
import { updateProva } from "@/app/actions";
import { useRouter } from "next/navigation";

export function EditProvaClient({ id, defaultValues }: { id: number, defaultValues: any }) {
  const router = useRouter();

  const handleSubmit = async (data: FormValues) => {
    const payload = {
        ...data,
        questions: data.questions.map(q => ({
            ...q,
            options: q.options.map(opt => ({ id: opt.uid, text: opt.text }))
        }))
    };
    
    await updateProva(id, payload);
    router.push(`/provas/${id}`);
  };

  return (
    <ProvaForm
      title="Editar Prova"
      description="Faça as alterações necessárias na sua prova."
      submitLabel="Salvar Alterações"
      defaultValues={defaultValues}
      onSubmitAction={handleSubmit}
    />
  );
}
