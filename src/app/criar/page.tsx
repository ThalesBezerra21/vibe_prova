"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { createProva } from "../actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";

type FormValues = {
  title: string;
  description: string;
  questions: {
    enunciado: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
};

const generateId = () => Math.random().toString(36).substring(2, 9);

function QuestionField({ questionIndex, control, register, errors, removeQuestion }: any) {
  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground relative space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Questão {questionIndex + 1}</h3>
        <button 
          type="button" 
          onClick={() => removeQuestion(questionIndex)}
          className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="text-sm font-medium">Enunciado *</label>
        <textarea 
          {...register(`questions.${questionIndex}.enunciado`, { required: "Enunciado é obrigatório" })} 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          placeholder="Qual é a capital do Brasil?"
        />
        {errors?.questions?.[questionIndex]?.enunciado && <span className="text-destructive text-sm mt-1">{errors.questions[questionIndex].enunciado.message}</span>}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Alternativas * (Mín. 2)</label>
        {options.map((option, optIndex) => (
          <div key={option.id} className="flex items-center gap-2">
            <Controller
              name={`questions.${questionIndex}.correctOptionId`}
              control={control}
              rules={{ required: "Selecione a alternativa correta" }}
              render={({ field }) => (
                <input 
                  type="radio" 
                  value={option.id}
                  checked={field.value === option.id}
                  onChange={() => field.onChange(option.id)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
              )}
            />
            <div className="flex-1">
              <input 
                {...register(`questions.${questionIndex}.options.${optIndex}.text`, { required: "Texto da alternativa é obrigatório" })} 
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Alternativa ${optIndex + 1}`}
              />
              <input type="hidden" {...register(`questions.${questionIndex}.options.${optIndex}.id`)} />
            </div>
            {options.length > 2 && (
              <button 
                type="button" 
                onClick={() => removeOption(optIndex)}
                className="text-muted-foreground hover:text-destructive p-2 rounded-md transition-colors"
                title="Remover alternativa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {errors?.questions?.[questionIndex]?.correctOptionId && (
            <span className="block text-destructive text-sm mt-1">{errors.questions[questionIndex].correctOptionId.message}</span>
        )}
        
        <button
          type="button"
          onClick={() => appendOption({ id: generateId(), text: "" })}
          className="text-sm text-primary hover:underline font-medium inline-flex items-center"
        >
          <Plus className="w-3 h-3 mr-1" /> Adicionar Alternativa
        </button>
      </div>
    </div>
  );
}

export default function CriarProva() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      questions: [
        { 
          enunciado: "", 
          options: [
            { id: "opt-1", text: "" },
            { id: "opt-2", text: "" },
          ],
          correctOptionId: "opt-1",
        }
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
            <QuestionField
              key={field.id}
              questionIndex={index}
              control={control}
              register={register}
              errors={errors}
              removeQuestion={remove}
            />
          ))}

          <button
            type="button"
            onClick={() => {
              const opt1 = generateId();
              const opt2 = generateId();
              append({ 
                enunciado: "", 
                options: [{ id: opt1, text: "" }, { id: opt2, text: "" }],
                correctOptionId: opt1
              });
            }}
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
