import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const provas = sqliteTable('provas', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const questions = sqliteTable('questions', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  type: text('type').$type<'single_choice' | 'multiple_choice' | 'sum_choice'>().notNull().default('single_choice'),
  enunciado: text('enunciado').notNull(),
  options: text('options', { mode: 'json' }).$type<{ id: string, text: string }[]>().notNull(),
  correctOptionId: text('correct_option_id').notNull(),
});

export const provaQuestions = sqliteTable('prova_questions', {
  provaId: integer('prova_id').notNull().references(() => provas.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.provaId, t.questionId] })
}));
