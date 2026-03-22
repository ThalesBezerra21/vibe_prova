import { useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, X, AlertCircle } from "lucide-react";
import { generateId } from "@/lib/utils";

export function QuestionEditor({
  questionIndex,
  control,
  register,
  errors,
  removeQuestion,
  clearErrors,
  watch
}: any) {
  // If questionIndex is provided, we are in a FormArray (ProvaForm)
  // If undefined, we are in a single QuestionForm
  const prefix = questionIndex !== undefined ? `questions.${questionIndex}` : "";
  const prefixPath = prefix ? `${prefix}.` : "";

  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: `${prefixPath}options`,
  });

  const questionType = watch(`${prefixPath}type`) || "single_choice";
  const questionError = questionIndex !== undefined ? errors?.questions?.[questionIndex]?.root?.message : errors?.root?.message;
  
  const enunciadoError = questionIndex !== undefined ? errors?.questions?.[questionIndex]?.enunciado : errors?.enunciado;
  const correctOptionError = questionIndex !== undefined ? errors?.questions?.[questionIndex]?.correctOptionId : errors?.correctOptionId;

  const handleInputChange = () => {
    if (questionError) {
      if (questionIndex !== undefined) {
        clearErrors(`questions.${questionIndex}.root`);
      } else {
        clearErrors("root");
      }
    }
  };

  const getOptionLabel = (index: number) => {
    if (questionType === "sum_choice") {
      return String(Math.pow(2, index)).padStart(2, '0');
    }
    return String.fromCharCode(65 + index);
  };

  return (
    <div className={`p-6 border rounded-lg bg-card text-card-foreground relative space-y-4 shadow-sm transition-colors ${questionError ? "border-destructive/50" : ""}`}>
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-medium">{questionIndex !== undefined ? `Questão ${questionIndex + 1}` : "Questão"}</h3>
        <div className="flex-1 flex justify-end items-center gap-2">
            <select
              {...register(`${prefixPath}type`)}
              onChange={(e) => {
                  register(`${prefixPath}type`).onChange(e);
                  handleInputChange();
              }}
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            >
              <option value="single_choice">Múltipla Escolha (1 correta)</option>
              <option value="multiple_choice">Múltipla Escolha (Várias corretas)</option>
              <option value="sum_choice">Somatório (Potências de 2)</option>
            </select>
            {removeQuestion && (
              <button 
                type="button" 
                onClick={() => removeQuestion(questionIndex)}
                className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
        </div>
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
          {...register(`${prefixPath}enunciado`, { required: "Enunciado é obrigatório" })}
          onChange={(e) => {
            register(`${prefixPath}enunciado`).onChange(e);
            handleInputChange();
          }}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm mt-1"
          placeholder="Qual é a capital do Brasil?"
        />
        {enunciadoError && <span className="text-destructive text-sm mt-1">{enunciadoError.message}</span>}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Alternativas * (Mín. 2 preenchidas)</label>
        {options.map((option: any, optIndex: number) => (
          <div key={option.id} className="flex items-center gap-2">
            <Controller
              name={`${prefixPath}correctOptionId`}
              control={control}
              render={({ field }) => {
                const isMulti = questionType === "multiple_choice" || questionType === "sum_choice";
                const currentVals = field.value ? field.value.split(",") : [];
                const isChecked = currentVals.includes(option.uid);

                return (
                  <input 
                    type={isMulti ? "checkbox" : "radio"} 
                    value={option.uid}
                    checked={isChecked}
                    onChange={(e) => {
                      if (isMulti) {
                        if (e.target.checked) {
                          field.onChange([...currentVals, option.uid].join(","));
                        } else {
                          field.onChange(currentVals.filter((v: string) => v !== option.uid).join(","));
                        }
                      } else {
                        field.onChange(option.uid);
                      }
                      handleInputChange();
                      if (correctOptionError) {
                        clearErrors(`${prefixPath}correctOptionId`);
                      }
                    }}
                    className={`w-4 h-4 text-primary focus:ring-primary ${isMulti ? 'rounded' : 'rounded-full'}`}
                  />
                );
              }}
            />
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium">
               {getOptionLabel(optIndex)}
            </div>
            <div className="flex-1 relative">
              <input 
                {...register(`${prefixPath}options.${optIndex}.text`)}
                onChange={(e) => {
                  register(`${prefixPath}options.${optIndex}.text`).onChange(e);
                  handleInputChange();
                }}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder={`Alternativa ${optIndex + 1}`}
              />
              <input type="hidden" {...register(`${prefixPath}options.${optIndex}.uid`)} defaultValue={option.uid} />
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
        {correctOptionError && (
            <span className="flex items-center text-destructive text-sm mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {correctOptionError.message}
            </span>
        )}

        <button
          type="button"
          onClick={() => {
            appendOption({ uid: generateId(), text: "" });
            handleInputChange();
          }}
          className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border bg-transparent hover:bg-muted py-2 px-3"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Alternativa
        </button>
      </div>
    </div>
  );
}
