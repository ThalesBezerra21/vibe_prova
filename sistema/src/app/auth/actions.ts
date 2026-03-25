'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSession, clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios' };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return { error: 'Credenciais inválidas' };
  }

  const isValidaPassword = await bcrypt.compare(password, user.password);
  if (!isValidaPassword) {
    return { error: 'Credenciais inválidas' };
  }

  await createSession(user.id);
  redirect('/provas');
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios' };
  }

  // Check existing
  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
  if (existingUser) {
    return { error: 'Email já está em uso' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [newUser] = await db.insert(users).values({
    email,
    password: hashedPassword,
  }).returning();

  await createSession(newUser.id);
  redirect('/criar');
}

export async function logout() {
  await clearSession();
  redirect('/entrar');
}
