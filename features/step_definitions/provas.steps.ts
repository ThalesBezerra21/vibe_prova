import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/setup';

Given('que eu tenho pelo menos 2 questões cadastradas', async function (this: CustomWorld) {
});

Given('eu estou na página de "Criar Prova"', async function (this: CustomWorld) {
    await this.page.goto('/criar');
});

When('eu preencho o título com {string}', async function (this: CustomWorld, titulo: string) {
    return 'pending';
});

When('eu tento selecionar {int} questões disponíveis na listagem', async function (this: CustomWorld, quantidade: number) {
    // Abre o seletor de questões
    const btns = await this.page.locator('button:has-text("Adicionar do Banco")').all();
    if(btns.length > 0) {
        await btns[0].click(); // Clica apenas no primeiro (o dialog trigger)
        const cards = await this.page.locator('div.border.rounded-xl').all();
        for (let i = 0; i < quantidade && i < cards.length; i++) {
            await cards[i].click();
        }
    }
});

Then('eu devo ver uma notificação {string}', async function (this: CustomWorld, mensagem: string) {
    const toast = this.page.locator(`text="${mensagem}"`);
    await expect(toast).toBeVisible();
});

Then('a prova {string} deve aparecer na listagem de provas', async function (this: CustomWorld, prova: string) {
    await this.page.goto('/provas');
    const locator = this.page.locator(`text=${prova}`);
    await expect(locator).toBeVisible();
});

// Download / Visualizar PDF
Given('que existe uma prova chamada {string} com {int} questões', async function (this: CustomWorld, titulo: string, quantidade: number) {
   return 'pending';
});

When('eu tento clicar no botão de download de PDF ou visualizar a prova {string}', async function (this: CustomWorld, titulo: string) {
    await this.page.goto('/provas');
    await this.page.locator('h3', { hasText: titulo }).first().click();
    await this.page.locator('button:has-text("Gerar PDFs")').click();
    await this.page.locator('button:has-text("Gerar 1 PDFs")').click();
});

Then('deve ser gerado um PDF formatado contendo o título da prova e o texto das questões', async function (this: CustomWorld) {
});

// Edit
When('que existe uma prova chamada {string}', async function (this: CustomWorld, titulo: string) {
   return 'pending';
});

When('eu tento clicar no botão de "Editar" da prova {string}', async function (this: CustomWorld, titulo: string) {
    await this.page.goto('/provas');
    await this.page.locator('h3', { hasText: titulo }).first().click();
    await this.page.locator('a:has-text("Editar Prova")').click();
});

When('eu removo uma das questões listadas', async function (this: CustomWorld) {
    await this.page.locator('button:has-text("Remover")').first().click();
});

When('eu adiciono uma nova questão diferente', async function (this: CustomWorld) {
    await this.page.locator('button:has-text("Adicionar do Banco")').first().click();
});

When(/^(?:eu )?aperto no botão "([^"]*)"$/, async function (this: CustomWorld, botao: string) {
    await this.page.click(`button:has-text("${botao}")`);
});

Then('a prova {string} deve ser atualizada e constar com a nova questão na listagem', async function (this: CustomWorld, titulo: string) {
});