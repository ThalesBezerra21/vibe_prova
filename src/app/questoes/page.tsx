import { db } from "@/db";
import { questions } from "@/db/schema";
import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { DeleteQuestionButton } from "./delete-button";

export default async function QuestoesPage() {
  const allQuestions = await db.select().from(questions);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Questões</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas questões criadas.</p>
        </div>
        <Link 
          href="/questoes/criar" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Questão
        </Link>
      </div>

      {allQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl bg-muted/20">
          <p className="text-muted-foreground">Nenhuma questão no banco.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allQuestions.map((q, i) => (
            <div key={q.id} className="p-6 border rounded-xl bg-card flex justify-between items-start group">
                <div>
                   <h3 className="font-semibold text-lg line-clamp-2">{q.enunciado}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href={`/questoes/${q.id}/editar`} className="p-2 border rounded hover:bg-muted text-foreground">
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteQuestionButton id={q.id} />
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
