import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { Button } from "./ui/button";

export async function UserNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/entrar" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors">Entrar</Link>
        <Link href="/registrar" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors border">Registrar</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">{user.email}</span>
      <form action={logout}>
        <Button variant="ghost" size="sm" type="submit">Sair</Button>
      </form>
    </div>
  );
}
