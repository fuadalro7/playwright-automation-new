import { Page, Locator } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(".title");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productNames = page.locator(".inventory_item_name");
    this.productPrices = page.locator(".inventory_item_price");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
  }

  async isLoaded(): Promise<boolean> {
    return this.title.isVisible();
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent()) || "";
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async getAllProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getAllPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace("$", "")));
  }

  async addMostExpensiveProducts(count: number) {
    const prices = await this.getAllPrices();

    // Get indices of top N prices
    const indexed = prices.map((price, i) => ({ price, i }));
    indexed.sort((a, b) => b.price - a.price);
    const topIndices = indexed.slice(0, count).map((item) => item.i);

    // Click add-to-cart for each
    const addButtons = this.page.locator(
      '.inventory_item .btn_inventory'
    );
    for (const idx of topIndices) {
      await addButtons.nth(idx).click();
    }
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
