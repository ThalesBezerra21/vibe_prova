import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { generateId } from "@/lib/utils";
import { QuestionEditor } from "./QuestionEditor";

export interface QuestionFormValues {
  id?: number;
  type: 'single_choice'|'multiple_choice'|'sum_choice';
  enunciado: string;
  correctOptionId: string;
  options: { uid: string; text: string }[];
}

interface QuestionOnlyFormProps {
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<QuestionFormValues>;
  onSubmitAction: (data: QuestionFormValues) => Promise<void>;
}

export function QuestionOnlyForm({
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmitAction,
}: QuestionOnlyFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    defaultValues: defaultValues || {
      type: "single_choice",
      enunciado: "",
      correctOptionId: "",
      options: [
        { uid: generateId(), text: "" },
        { uid: generateId(), text: "" },
      ],
    },
  });

  const onSubmit = async (data: QuestionFormValues) => {
    try {
      const filledOptions = data.options.filter(opt => opt.text.trim() !== "");
      if (filledOptions.length < 2) {
        setError("root", { type: "manual", message: "Preencha o texto de pelo menos 2 alternativas." });
        return;
      }

      if (!data.correctOptionId || data.correctOptionId.trim() === "") {
         setError("correctOptionId", { type: "manual", message: "Selecione a(s) alternativa(s) correta(s)." });
         return;
      }

      await onSubmitAction(data);
    } catch (err) {
      setError("root", { type: "manual", message: "Erro ao salvar questão." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <QuestionEditor 
          control={control}
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          watch={watch}
        />

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 py-2"
          >
            {isSubmitting ? (
              <span className="flex items-center">Salvando...</span>
            ) : (
              <span className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                {submitLabel}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
