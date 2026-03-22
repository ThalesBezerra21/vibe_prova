import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        Bem-vindo ao <span className="text-primary">Vibe Prova</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px]">
        O jeito mais fácil e rápido de criar provas com questões de múltipla escolha para seus alunos ou treinamentos.
      </p>
      <div className="flex gap-4 mt-4">
        <Link href="/criar" className="h-10 px-8 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90">
          Criar Nova Prova
        </Link>
        <Link href="/provas" className="h-10 px-8 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors">
          Ver Provas Salvas
        </Link>
        <Link href="/questoes" className="h-10 px-8 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors">
          Ver Questões Salvas
        </Link>
      </div>
    </div>
  );
}
