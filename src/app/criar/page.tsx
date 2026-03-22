"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { createProva } from "../actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Plus, Trash2, Save } from "lucide-react";

type FormValues = {
  title: string;
  description: string;
  questions: {
    enunciado: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
  }[];
};

export default function CriarProva() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      questions: [
        { enunciado: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "optionA" }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control
  });

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        await createProva(data);
        router.push("/provas");
      } catch (error) {
        console.error(error);
        alert("Erro ao criar prova");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Criar Nova Prova</h1>
        <p className="text-muted-foreground">Adicione os detalhes da prova e suas questões.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
          <div>
            <label className="text-sm font-medium">Título da Prova *</label>
            <input 
              {...register("title", { required: "Título é obrigatório" })} 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              placeholder="Ex: Prova de Matemática - 1º Bimestre"
            />
            {errors.title && <span className="text-destructive text-sm mt-1">{errors.title.message}</span>}
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea 
              {...register("description")} 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              placeholder="Instruções e detalhes adicionais..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Questões</h2>
          
          {fields.map((field, index) => (
            <div key={field.id} className="p-6 border rounded-lg bg-card text-card-foreground relative space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Questão {index + 1}</h3>
                {fields.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Enunciado *</label>
                <textarea 
                  {...register(`questions.${index}.enunciado` as const, { required: "Enunciado é obrigatório" })} 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  placeholder="Qual é a capital do Brasil?"
                />
                {errors.questions?.[index]?.enunciado && <span className="text-destructive text-sm mt-1">{errors.questions[index]?.enunciado?.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["A", "B", "C", "D"] as const).map((letter) => (
                  <div key={letter}>
                    <label className="text-sm font-medium text-muted-foreground">Alternativa {letter} *</label>
                    <input 
                      {...register(`questions.${index}.option${letter}` as const, { required: `A alternativa ${letter} é obrigatória` })} 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      placeholder={`Opção ${letter}`}
                    />
                    {errors.questions?.[index]?.[`option${letter}` as const] && (
                        <span className="text-destructive text-sm mt-1 text-xs">{errors.questions[index]?.[`option${letter}` as const]?.message}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-sm font-medium">Alternativa Correta *</label>
                <select 
                  {...register(`questions.${index}.correctOption` as const)}
                  className="flex h-10 w-full md:w-[200px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                >
                  <option value="optionA">Alternativa A</option>
                  <option value="optionB">Alternativa B</option>
                  <option value="optionC">Alternativa C</option>
                  <option value="optionD">Alternativa D</option>
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ enunciado: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "optionA" })}
            className="w-full flex items-center justify-center p-4 border-2 border-dashed rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Questão
          </button>
        </div>

        <div className="flex justify-end p-4 bg-background/95 backdrop-blur border-t sticky bottom-0 -mx-4 md:rounded-b-lg">
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center bg-primary text-primary-foreground h-11 px-8 rounded-md font-medium hover:bg-primary/90 disabled:opacity-70 transition-colors"
          >
            {isPending ? "Salvando..." : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Prova
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
