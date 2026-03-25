'use client';

import { useActionState } from 'react';
import { register } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(async (state: any, data: FormData) => {
    return register(data);
  }, null);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastrar</CardTitle>
          <CardDescription>
            Insira suas informações abaixo para criar uma conta.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="m@exemplo.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.error && (
              <div className="text-sm font-medium text-destructive">{state.error}</div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4 mt-8">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/entrar" className="underline underline-offset-4">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
