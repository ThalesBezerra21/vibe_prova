"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { BookmarkPlus, Plus, Save, AlertCircle } from "lucide-react";
import { generateId } from "@/lib/utils";
import { QuestionPicker } from "./QuestionPicker";
import { QuestionEditor } from "./QuestionEditor";

export interface QuestionLocal {
  id?: number;
  type: 'single_choice'|'multiple_choice'|'sum_choice';
  enunciado: string;
  options: { uid: string; text: string }[];
  correctOptionId: string;
}

export interface FormValues {
  title: string;
  description: string;
  questions: QuestionLocal[];
}

interface ProvaFormProps {
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<FormValues>;
  onSubmitAction: (data: FormValues) => Promise<void>;
}

export function ProvaForm({
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmitAction,
}: ProvaFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      questions: [
        {
          type: "single_choice",
          enunciado: "",
          options: [
            { uid: generateId(), text: "" },
            { uid: generateId(), text: "" },
          ],
          correctOptionId: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const formError = errors.root?.message;

  const handleInputChange = () => {
    if (formError) clearErrors("root");
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (data.questions.length === 0) {
        setError("root", {
          type: "manual",
          message: "A prova deve ter pelo menos uma questão.",
        });
        return;
      }

      for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i];
        const validOptions = q.options.filter(opt => opt.text.trim() !== "");
        
        if (validOptions.length < 2) {
          setError(`questions.${i}.enunciado`, {
            type: "manual",
            message: "Preencha o texto de pelo menos 2 alternativas.",
          });
          return;
        }

        if (!q.correctOptionId || q.correctOptionId.trim() === "") {
          setError(`questions.${i}.correctOptionId`, {
             type: "manual",
             message: "Selecione a(s) alternativa(s) correta(s)."
          });
          return;
        }

        // Se multiple/sum choice, pode ter mais de um. Senão 1.
        // Já verificamos se pelo menos tem algum não nulo acima
      }

      await onSubmitAction(data);
    } catch (err) {
      setError("root", {
        type: "manual",
        message: "Ocorreu um erro ao salvar a prova. Tente novamente.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">{title}</h1>
        <p className="text-xl text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {formError && (
          <div className="flex items-center text-sm font-medium text-destructive bg-destructive/10 p-4 rounded-md">
            <AlertCircle className="w-5 h-5 mr-3" />
            {formError}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4 p-6 border rounded-xl bg-card shadow-sm">
            <div>
              <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Título da Prova *
              </label>
              <input
                id="title"
                {...register("title", { required: "Título é obrigatório" })}
                onChange={(e) => {
                  register("title").onChange(e);
                  handleInputChange();
                }}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                placeholder="Ex: Prova de Matemática - 1º Bimestre"
              />
              {errors.title && <span className="text-destructive text-sm mt-1">{errors.title.message}</span>}
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Descrição (opcional)
              </label>
              <textarea
                id="description"
                {...register("description")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                placeholder="Ex: Instruções para os alunos..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight border-b pb-4">Questões</h2>

          <div className="space-y-8">
            {fields.map((field, index) => (
              <QuestionEditor 
                key={field.id}
                questionIndex={index}
                control={control}
                register={register}
                errors={errors}
                removeQuestion={remove}
                clearErrors={clearErrors}
                watch={watch}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={() => {
                const opt1 = generateId();
                const opt2 = generateId();
                append({ 
                  type: "single_choice",
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
            disabled={isSubmitting}
            className="flex items-center bg-primary text-primary-foreground h-11 px-8 rounded-md font-medium hover:bg-primary/90 disabled:opacity-70 transition-colors"
          >
            {isSubmitting ? "Processando..." : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
