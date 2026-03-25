import Link from 'next/link';
import { getCurrentUser } from "@/lib/auth";
import { UserNav } from "@/components/UserNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function MainNav() {
  const user = await getCurrentUser();

  return (
    <nav className="flex items-center gap-2">
      <Link href="/" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors">Início</Link>
      
      {user && (
        <>
          <Link href="/questoes" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors">Questões</Link>
          <Link href="/provas" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors">Provas</Link>
          <Link href="/correcao" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors">Corrigir Provas</Link>
          <Link href="/criar" className="px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/95 rounded-md transition-colors">Criar Prova</Link>
        </>
      )}
      
      <div className="ml-2 w-[1px] h-6 bg-border mx-1"></div>
      <UserNav />
      <div className="ml-2 w-[1px] h-6 bg-border mx-1"></div>
      <ThemeToggle />
    </nav>
  );
}
