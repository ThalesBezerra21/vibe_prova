import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/setup';

Given('que estou na página de "Corrigir Provas"', async function (this: CustomWorld) {
    await this.page.goto('/correcao');
});

When('eu seleciono um "CSV de Gabarito" com dados válidos da {string}', async function (this: CustomWorld, prova: string) {
    return 'pending';
});

When('eu seleciono um "CSV de Respostas" com um aluno com {string} contendo as alternativas corretas', async function (this: CustomWorld, prova: string) {
    const csvContent = `Nome;Prova;Q1;Q2\nAluno Teste;${prova};A;B`;
    const buffer = Buffer.from(csvContent);
    // index 1 = Segundo input de arquivo (Respostas)
    await this.page.locator('input[type="file"]').nth(1).setInputFiles({
        name: 'respostas.csv',
        mimeType: 'text/csv',
        buffer
    });
});

When('eu escolho o rigor de correção {string}', async function (this: CustomWorld, rigor: string) {
    await this.page.locator('select').selectOption(rigor);
});

Then('um relatório de correções deve ser exibido na tela com a nota total do aluno', async function (this: CustomWorld) {
    await expect(this.page.locator('table')).toBeVisible();
    await expect(this.page.locator('td', { hasText: '10.00' })).toBeVisible();
});

Then('uma notificação de sucesso {string} deve aparecer', async function (this: CustomWorld, mensagem: string) {
    const toast = this.page.locator(`text="${mensagem}"`);
    await expect(toast).toBeVisible();
});

When('eu seleciono um "CSV de Gabarito" com dados válidos de múltiplas alternativas da {string}', async function (this: CustomWorld, prova: string) {
    return 'pending';
});

When('eu seleciono um "CSV de Respostas" com um aluno com metades as alternativas corretas', async function (this: CustomWorld) {
    const csvContent = `Nome;Prova;Q1;Q2\nAluno Teste;Prova B1;A;C`; 
    const buffer = Buffer.from(csvContent);
    await this.page.locator('input[type="file"]').nth(1).setInputFiles({
        name: 'respostas_parciais.csv',
        mimeType: 'text/csv',
        buffer
    });
});

Then('a nota do aluno deve ser calculada de forma proporcional aos acertos', async function (this: CustomWorld) {
    await expect(this.page.locator('table')).toBeVisible();
    await expect(this.page.locator('td', { hasText: '5.00' })).toBeVisible();
});

When('eu seleciono um CSV de Respostas em branco ou mal formatado', async function (this: CustomWorld) {
    return 'pending';
});

When('um CSV de Gabarito válido', async function (this: CustomWorld) {
    const csvContent = `Prova;Q1;Q2\n1;A;B`;
    const buffer = Buffer.from(csvContent);
    await this.page.locator('input[type="file"]').nth(0).setInputFiles({
        name: 'gabarito.csv',
        mimeType: 'text/csv',
        buffer
    });
});

Then('uma notificação de erro deve aparecer informando {string}', async function (this: CustomWorld, mensagem: string) {
    const toast = this.page.locator(`text="${mensagem}"`);
    await expect(toast).toBeVisible();
});

Then('nenhum dado deve ser exibido na tela', async function (this: CustomWorld) {
    await expect(this.page.locator('table')).not.toBeVisible();
});

When('eu aperto no botão "Corrigir Provas" sem selecionar ambos os arquivos CSV', async function (this: CustomWorld) {
    return 'pending';
});

Then('eu devo ver uma notificação informando {string}', async function (this: CustomWorld, mensagem: string) {
    const toast = this.page.locator(`text="${mensagem}"`);
    await expect(toast).toBeVisible();
});

Then('nenhum processamento deve ocorrer', async function (this: CustomWorld) {
    await expect(this.page.locator('table')).not.toBeVisible();
});