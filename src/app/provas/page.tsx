import { db } from "@/db";
import { provas } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Clock, PlusCircle } from "lucide-react";

import { DeleteButton } from "./delete-button";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProvasPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const savedProvas = await db.select().from(provas).where(eq(provas.userId, user.id)).orderBy(desc(provas.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provas Salvas</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas provas e veja os detalhes.</p>
        </div>
        <Link 
          href="/criar" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Prova
        </Link>
      </div>

      {savedProvas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl bg-muted/20">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <PlusCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma prova encontrada</h3>
          <p className="text-muted-foreground mb-6 max-w-[400px]">Você ainda não criou nenhuma prova. Clique no botão abaixo para começar.</p>
          <Link 
            href="/criar" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
          >
            Criar Prova
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProvas.map((prova) => (
            <Link key={prova.id} href={`/provas/${prova.id}`}>
              <div className="group flex flex-col justify-between h-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all hover:border-primary/50">
                <div className="p-6">
                  <h3 className="font-semibold text-xl leading-none tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{prova.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {prova.description || "Sem descrição"}
                  </p>
                </div>
                <div className="px-6 py-4 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Criada em {new Date(prova.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="relative z-10">
                    <DeleteButton provaId={prova.id} provaTitle={prova.title} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
