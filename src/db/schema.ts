import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const provas = sqliteTable('provas', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const questions = sqliteTable('questions', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  provaId: integer('prova_id').notNull().references(() => provas.id, { onDelete: 'cascade' }),
  enunciado: text('enunciado').notNull(),
  optionA: text('option_a').notNull(),
  optionB: text('option_b').notNull(),
  optionC: text('option_c').notNull(),
  optionD: text('option_d').notNull(),
  correctOption: text('correct_option').notNull(),
});
