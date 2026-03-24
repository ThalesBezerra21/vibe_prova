import { Before, BeforeAll, AfterAll, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from 'playwright';

setDefaultTimeout(60000);

let browser: Browser;

export class CustomWorld {
  public page!: Page;
  public context!: BrowserContext;
}

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true });
});

AfterAll(async function () {
  await browser.close();
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({ baseURL: 'http://localhost:3000' });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  await this.page.close();
  await this.context.close();
});