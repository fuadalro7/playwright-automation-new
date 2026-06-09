import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.itemTotal = page.locator(".summary_subtotal_label");
    this.completeHeader = page.locator(".complete-header");
    this.completeText = page.locator(".complete-text");
    this.itemPrices = page.locator(".inventory_item_price");
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async getItemTotal(): Promise<number> {
    const text = (await this.itemTotal.textContent()) || "";
    // Format: "Item total: $xx.xx"
    return parseFloat(text.replace("Item total: $", ""));
  }

  async getIndividualPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace("$", "")));
  }

  async finish() {
    await this.finishButton.click();
  }

  async getConfirmationHeader(): Promise<string> {
    return (await this.completeHeader.textContent()) || "";
  }

  async getConfirmationText(): Promise<string> {
    return (await this.completeText.textContent()) || "";
  }
}
