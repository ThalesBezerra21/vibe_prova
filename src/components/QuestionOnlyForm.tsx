import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Save, X, AlertCircle } from "lucide-react";

const generateId = () => Math.random().toString(36).substring(2, 9);

export interface QuestionFormValues {
  id?: number;
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
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    defaultValues: defaultValues || {
      enunciado: "",
      correctOptionId: "",
      options: [
        { uid: generateId(), text: "" },
        { uid: generateId(), text: "" },
      ],
    },
  });

  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: `options`,
  });

  const formError = errors.root?.message;

  const handleInputChange = () => {
    if (formError) clearErrors("root");
  };

  const onSubmit = async (data: QuestionFormValues) => {
    try {
      const filledOptions = data.options.filter(opt => opt.text.trim() !== "");
      if (filledOptions.length < 2) {
        setError("root", {
          type: "manual",
          message: "Preencha o texto de pelo menos 2 alternativas.",
        });
        return;
      }

      if (!data.correctOptionId) {
         setError("correctOptionId", {
           type: "manual",
           message: "Selecione a alternativa correta."
         });
         return;
      }
      
      const correctOptText = data.options.find(o => o.uid === data.correctOptionId)?.text;
      if (!correctOptText || correctOptText.trim() === "") {
        setError("root", {
          type: "manual",
          message: "A alternativa correta selecionada não pode estar vazia.",
        });
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
        <div className={`p-6 border rounded-lg bg-card text-card-foreground relative space-y-4 shadow-sm transition-colors ${formError ? "border-destructive/50" : ""}`}>
          {formError && (
            <div className="flex items-center text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="w-4 h-4 mr-2" />
              {formError}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Enunciado *</label>
            <textarea 
              {...register("enunciado", { required: "Enunciado é obrigatório" })}
              onChange={(e) => {
                register("enunciado").onChange(e);
                handleInputChange();
              }}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              placeholder="Qual é a capital do Brasil?"
            />
            {errors.enunciado && <span className="text-destructive text-sm mt-1">{errors.enunciado.message}</span>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Alternativas * (Mín. 2 preenchidas)</label>
            {options.map((option: any, optIndex: number) => (
              <div key={option.id} className="flex items-center gap-2">
                <Controller
                  name="correctOptionId"
                  control={control}
                  render={({ field }) => (
                    <input 
                      type="radio" 
                      value={option.uid}
                      checked={field.value === option.uid}
                      onChange={() => {
                        field.onChange(option.uid);
                        handleInputChange();
                        if (errors.correctOptionId) {
                          clearErrors("correctOptionId");
                        }
                      }}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                  )}
                />
                <div className="flex-1 relative">
                  <input 
                    {...register(`options.${optIndex}.text` as const)}
                    onChange={(e) => {
                      register(`options.${optIndex}.text` as const).onChange(e);
                      handleInputChange();
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={`Alternativa ${optIndex + 1}`}
                  />
                  <input type="hidden" {...register(`options.${optIndex}.uid` as const)} defaultValue={option.uid} />
                </div>
                {options.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => {
                      removeOption(optIndex);
                      handleInputChange();
                    }}
                    className="text-muted-foreground hover:text-destructive p-2 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {errors.correctOptionId && (
                <span className="flex items-center text-destructive text-sm mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.correctOptionId.message}
                </span>
            )}

            <button
              type="button"
              onClick={() => {
                appendOption({ uid: generateId(), text: "" });
                handleInputChange();
              }}
              className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 border bg-transparent hover:bg-muted py-2 px-3"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Alternativa
            </button>
          </div>
        </div>

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
