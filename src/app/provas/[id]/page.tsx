import { db } from "@/db";
import { provas, questions, provaQuestions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Pencil } from "lucide-react";
import { PDFGenerator } from "@/components/PDFGenerator";

export default async function ProvaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provaId = parseInt(id, 10);

  if (isNaN(provaId)) {
    notFound();
  }

  const prova = await db.query.provas.findFirst({
    where: eq(provas.id, provaId),
  });

  if (!prova) {
    notFound();
  }

  const provaQuestionsList = await db
    .select({
      id: questions.id,
      type: questions.type,
      enunciado: questions.enunciado,
      options: questions.options,
      correctOptionId: questions.correctOptionId,
    })
    .from(questions)
    .innerJoin(provaQuestions, eq(questions.id, provaQuestions.questionId))
    .where(eq(provaQuestions.provaId, prova.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link 
        href="/provas" 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Voltar para Provas
      </Link>

      <div className="border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">{prova.title}</h1>
        {prova.description && (
          <p className="text-xl text-muted-foreground">{prova.description}</p>
        )}
        <div className="flex items-center space-x-4 mt-6">
          <Link
            href={`/provas/${prova.id}/editar`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-secondary text-secondary-foreground shadow hover:bg-secondary/80 h-10 px-4 py-2"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar Prova
          </Link>
          <PDFGenerator 
            provaData={{
              title: prova.title,
              questions: provaQuestionsList
            }}
          />
          <div className="flex items-center text-sm text-muted-foreground">
          Criada em {new Date(prova.createdAt).toLocaleDateString("pt-BR")}
          <span className="mx-2">•</span>
          {provaQuestionsList.length} {provaQuestionsList.length === 1 ? 'questão' : 'questões'}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {provaQuestionsList.map((q, index) => (
          <div key={q.id} className="p-8 border rounded-xl bg-card text-card-foreground shadow-sm">
            <h3 className="text-2xl font-semibold mb-6">
              <span className="text-primary mr-2">{index + 1}.</span> 
              {q.enunciado}
            </h3>

            {q.type === 'sum_choice' && (() => {
              const sum = q.options.reduce((acc, opt, optIdx) => {
                 return q.correctOptionId.split(',').includes(opt.id as string) ? acc + Math.pow(2, optIdx) : acc;
              }, 0);
              return (
                <div className="mb-4 text-sm font-medium text-muted-foreground bg-muted/30 p-3 rounded-lg border inline-block">Soma Correta: <span className="text-foreground font-bold">{sum}</span></div>
              )
            })()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, optIndex) => {
                const isCorrect = q.correctOptionId.split(',').includes(opt.id as string);
                const letter = q.type === 'sum_choice' 
                    ? String(Math.pow(2, optIndex)).padStart(2, '0') 
                    : String.fromCharCode(65 + optIndex);

                return (
                  <div 
                    key={opt.id}
                    className={`relative flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
                      isCorrect 
                        ? "border-green-500 bg-green-500/10 text-green-900" 
                        : "border-muted bg-background hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-medium">
                      {letter}
                    </div>
                    <div className="flex-1 text-sm font-medium leading-none self-center">
                      {opt.text}
                    </div>
                    {isCorrect && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
