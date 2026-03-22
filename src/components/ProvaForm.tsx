"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useTransition } from "react";
import { BookmarkPlus } from "lucide-react";
import { QuestionPicker } from "./QuestionPicker";
import { Plus, Trash2, Save, X, AlertCircle } from "lucide-react";

export type FormValues = {
  title: string;
  description: string;
  questions: {
    enunciado: string;
    options: { uid: string; text: string }[];
    correctOptionId: string;
  }[];
};

const generateId = () => Math.random().toString(36).substring(2, 9);

function QuestionField({ questionIndex, control, register, errors, removeQuestion, clearErrors }: any) {
  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const questionError = errors?.questions?.[questionIndex]?.root?.message;

  const handleInputChange = () => {
    if (questionError) {
      clearErrors(`questions.${questionIndex}.root`);
    }
  };

  return (
    <div className={`p-6 border rounded-lg bg-card text-card-foreground relative space-y-4 shadow-sm transition-colors ${questionError ? "border-destructive/50" : ""}`}>
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

      {questionError && (
        <div className="flex items-center text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2" />
          {questionError}
        </div>
      )}

      <div>
        <label className="text-sm font-medium">Enunciado *</label>
        <textarea 
          {...register(`questions.${questionIndex}.enunciado`, { required: "Enunciado é obrigatório" })}
          onChange={(e) => {
            register(`questions.${questionIndex}.enunciado`).onChange(e);
            handleInputChange();
          }}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          placeholder="Qual é a capital do Brasil?"
        />
        {errors?.questions?.[questionIndex]?.enunciado && <span className="text-destructive text-sm mt-1">{errors.questions[questionIndex].enunciado.message}</span>}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Alternativas * (Mín. 2 preenchidas)</label>
        {options.map((option: any, optIndex) => (
          <div key={option.id} className="flex items-center gap-2">
            <Controller
              name={`questions.${questionIndex}.correctOptionId`}
              control={control}
              render={({ field }) => (
                <input 
                  type="radio" 
                  value={option.uid}
                  checked={field.value === option.uid}
                  onChange={() => {
                    field.onChange(option.uid);
                    handleInputChange();
                    if (errors?.questions?.[questionIndex]?.correctOptionId) {
                      clearErrors(`questions.${questionIndex}.correctOptionId`);
                    }
                  }}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
              )}
            />
            <div className="flex-1 relative">
              <input 
                {...register(`questions.${questionIndex}.options.${optIndex}.text`)}
                onChange={(e) => {
                  register(`questions.${questionIndex}.options.${optIndex}.text`).onChange(e);
                  handleInputChange();
                }}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Alternativa ${optIndex + 1}`}
              />
              <input type="hidden" {...register(`questions.${questionIndex}.options.${optIndex}.uid`)} defaultValue={option.uid} />
            </div>
            {options.length > 2 && (
              <button 
                type="button" 
                onClick={() => {
                  removeOption(optIndex);
                  handleInputChange();
                }}
                className="text-muted-foreground hover:text-destructive p-2 rounded-md transition-colors"
                title="Remover alternativa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {errors?.questions?.[questionIndex]?.correctOptionId && (
            <span className="flex items-center text-destructive text-sm mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {errors.questions[questionIndex].correctOptionId.message}
            </span>
        )}
        
        <button
          type="button"
          onClick={() => {
            appendOption({ uid: generateId(), text: "" });
            handleInputChange();
          }}
          className="text-sm text-primary hover:underline font-medium inline-flex items-center"
        >
          <Plus className="w-3 h-3 mr-1" /> Adicionar Alternativa
        </button>
      </div>
    </div>
  );
}

export function ProvaForm({ 
  defaultValues, 
  onSubmitAction, 
  title, 
  description,
  submitLabel = "Salvar Prova"
}: { 
  defaultValues?: Partial<FormValues>, 
  onSubmitAction: (data: FormValues) => Promise<void>,
  title: string,
  description: string,
  submitLabel?: string
}) {
  const [isPending, startTransition] = useTransition();

  const fallbackDefaultValues: FormValues = {
    title: "",
    description: "",
    questions: [
      { 
        enunciado: "", 
        options: [
          { uid: generateId(), text: "" },
          { uid: generateId(), text: "" },
        ],
        correctOptionId: "",
      }
    ]
  };

  const { register, control, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<FormValues>({
    defaultValues: defaultValues || fallbackDefaultValues
  });

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control
  });

  const onSubmit = (data: FormValues) => {
    let hasError = false;
    clearErrors();

    const cleanedQuestions = data.questions.map((q, qIndex) => {
      const filledOptions = q.options.filter((opt) => opt.text && opt.text.trim() !== "");

      if (filledOptions.length < 2) {
        setError(`questions.${qIndex}.root` as any, { 
          type: "manual", 
          message: "Preencha o texto de pelo menos 2 alternativas." 
        });
        hasError = true;
      }

      if (!q.correctOptionId) {
        setError(`questions.${qIndex}.correctOptionId`, { 
          type: "manual", 
          message: "Selecione qual é a alternativa correta marcando a bolinha." 
        });
        hasError = true;
      } else {
        const selectedOpt = q.options.find(o => o.uid === q.correctOptionId);
        if (!selectedOpt || !selectedOpt.text || selectedOpt.text.trim() === "") {
          setError(`questions.${qIndex}.correctOptionId`, { 
            type: "manual", 
            message: "A alternativa selecionada como correta não pode estar em branco." 
          });
          hasError = true;
        }
      }

      return {
        ...q,
        options: filledOptions,
      };
    });

    if (hasError) return;

    const cleanedData = { ...data, questions: cleanedQuestions };

    startTransition(async () => {
      try {
        await onSubmitAction(cleanedData);
      } catch (error) {
        console.error(error);
        alert("Erro ao processo prova");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
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
              clearErrors={clearErrors}
            />
          ))}

          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={() => {
                const opt1 = generateId();
                const opt2 = generateId();
                append({ 
                  enunciado: "", 
                  options: [{ uid: opt1, text: "" }, { uid: opt2, text: "" }],
                  correctOptionId: ""
                });
              }}
              className="flex-1 flex items-center justify-center p-4 border-2 border-dashed rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Questão Manual
            </button>
            <QuestionPicker onSelect={(q) => append(q)} />
          </div>
        </div>

        <div className="flex justify-end p-4 bg-background/95 backdrop-blur border-t sticky bottom-0 -mx-4 md:rounded-b-lg z-20">
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center bg-primary text-primary-foreground h-11 px-8 rounded-md font-medium hover:bg-primary/90 disabled:opacity-70 transition-colors"
          >
            {isPending ? "Processando..." : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
