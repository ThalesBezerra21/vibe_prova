import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/setup';

Given('que estou na página de "Criar Questão"', async function (this: CustomWorld) {
  await this.page.goto('/questoes/criar');
});

When('eu preencho o enunciado com {string}', async function (this: CustomWorld, enunciado: string) {
  await this.page.fill('textarea[name="enunciado"]', enunciado);
});

When('eu adiciono a alternativa {string} com o texto {string}', async function (this: CustomWorld, letra: string, texto: string) {
  const index = letra.charCodeAt(0) - 65;
  await this.page.locator('input[placeholder^="Alternativa"]').nth(index).fill(texto);
});

When('eu adiciono a alternativa {string} com o texto {string} marcando-a como correta', async function (this: CustomWorld, letra: string, texto: string) {
  const index = letra.charCodeAt(0) - 65;
  await this.page.locator('input[placeholder^="Alternativa"]').nth(index).fill(texto);
  await this.page.locator('input[type="radio"], input[type="checkbox"]').nth(index).check();
});

When('eu aperto no botão {string}', async function (this: CustomWorld, botao: string) {
  await this.page.click(`button:has-text("${botao}")`);
});

Then('eu devo ver uma mensagem de sucesso {string}', async function (this: CustomWorld, mensagem: string) {
  const toast = this.page.locator('.sonner-toast:has-text("' + mensagem + '")');
  await expect(toast).toBeVisible();
});

Then('a questão {string} deve aparecer na lista de questões', async function (this: CustomWorld, questao: string) {
  await this.page.goto('/questoes');
  const locator = this.page.locator(`text=${questao}`);
  await expect(locator).toBeVisible();
});

// Edit & Delete
Given('que existe uma questão chamada {string}', async function (this: CustomWorld, questao: string) {
  await this.page.goto('/questoes/criar');
  await this.page.fill('textarea[name="enunciado"]', questao);
  await this.page.locator('input[placeholder^="Alternativa"]').nth(0).fill("A");
  await this.page.locator('input[placeholder^="Alternativa"]').nth(1).fill("B");
  await this.page.locator('input[type="radio"], input[type="checkbox"]').nth(0).check();
  await this.page.click('button:has-text("Salvar")');
  await this.page.waitForTimeout(1000);
});

Given('eu estou na página de listagem de questões', async function (this: CustomWorld) {
  await this.page.goto('/questoes');
});

When('eu aperto no botão "Editar" na questão {string}', async function (this: CustomWorld, questao: string) {
  const isRow = this.page.locator('div.border.rounded-xl', { hasText: questao }).first();
  await isRow.locator('a[href*="/editar"]').click();
});

When('eu altero o enunciado para {string}', async function (this: CustomWorld, questao: string) {
  await this.page.fill('textarea[name="enunciado"]', questao);
});

Then('o novo enunciado deve aparecer na listagem', async function (this: CustomWorld) {
  await this.page.goto('/questoes');
});

// Delete
Given('que existe uma questão com enunciado de teste', async function(this: CustomWorld) {
  await this.page.goto('/questoes/criar');
  await this.page.fill('textarea[name="enunciado"]', "Enunciado de teste");
  await this.page.locator('input[placeholder^="Alternativa"]').nth(0).fill("A");
  await this.page.locator('input[placeholder^="Alternativa"]').nth(1).fill("B");
  await this.page.locator('input[type="radio"], input[type="checkbox"]').nth(0).check();
  await this.page.click('button:has-text("Salvar")');
  await this.page.waitForTimeout(1000);
});

When('eu aperto no botão "Excluir" na questão', async function(this: CustomWorld) {
   const isRow = this.page.locator('div.border.rounded-xl').first();
   await isRow.locator('button[aria-label="Deletar questão"]').click();
});

When('eu confirmo a exclusão', async function(this: CustomWorld) {
   await this.page.locator('button:has-text("Deletar")').first().click();
});

Then('a questão não deve mais estar na lista', async function(this: CustomWorld) {
});

Then('eu devo ver uma mensagem {string}', async function(this: CustomWorld, mensagem: string) {
  const toast = this.page.locator(`text="${mensagem}"`);
  await expect(toast).toBeVisible();
});