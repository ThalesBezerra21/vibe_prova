import { db } from "@/db";
import { provas, questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

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

  const provaQuestions = await db.query.questions.findMany({
    where: eq(questions.provaId, prova.id),
  });

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
        <div className="mt-6 flex items-center text-sm text-muted-foreground">
          Criada em {new Date(prova.createdAt).toLocaleDateString("pt-BR")}
          <span className="mx-2">•</span>
          {provaQuestions.length} {provaQuestions.length === 1 ? 'questão' : 'questões'}
        </div>
      </div>

      <div className="space-y-12">
        {provaQuestions.map((q, index) => (
          <div key={q.id} className="p-8 border rounded-xl bg-card text-card-foreground shadow-sm">
            <h3 className="text-2xl font-semibold mb-6">
              <span className="text-primary mr-2">{index + 1}.</span> 
              {q.enunciado}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["A", "B", "C", "D"] as const).map((letter) => {
                const optKey = `option${letter}` as keyof typeof q;
                const isCorrect = q.correctOption === `option${letter}`;

                return (
                  <div 
                    key={letter}
                    className={`relative flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
                      isCorrect 
                        ? "border-green-500 bg-green-500/10 dark:bg-green-500/5 text-green-900 dark:text-green-100" 
                        : "border-muted bg-background hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-medium">
                      {letter}
                    </div>
                    <div className="flex-1 text-sm font-medium leading-none self-center">
                      {q[optKey]}
                    </div>
                    {isCorrect && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-4 border-t flex items-center text-sm">
              <span className="font-semibold text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Alternativa Correta: {q.correctOption.replace("option", "Alternativa ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
