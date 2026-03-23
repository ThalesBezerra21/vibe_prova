import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8 px-4">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Vibe Prova</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
          O jeito mais fácil e rápido de criar provas com questões de múltipla escolha para seus alunos ou treinamentos.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
        <Link href="/criar" className="h-12 px-8 inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105">
          Criar Nova Prova
        </Link>
        <Link href="/provas" className="h-12 px-8 inline-flex w-full sm:w-auto items-center justify-center rounded-lg border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground text-base font-medium shadow-sm transition-all hover:scale-105">
          Ver Provas Salvas
        </Link>
        <Link href="/questoes" className="h-12 px-8 inline-flex w-full sm:w-auto items-center justify-center rounded-lg border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground text-base font-medium shadow-sm transition-all hover:scale-105">
          Ver Questões Salvas
        </Link>
        <Link href="/correcao" className="h-12 px-8 inline-flex w-full sm:w-auto items-center justify-center rounded-lg border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground text-base font-medium shadow-sm transition-all hover:scale-105">
          Corrigir provas
        </Link>
      </div>
    </div>
  );
}
