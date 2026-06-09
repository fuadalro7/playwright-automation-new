import { test, expect } from "@playwright/test";
import { LoginPage, ProductsPage } from "../../src/pages";
import testData from "../../src/data/test-data.json";

test.describe("Products Tests", () => {
  test("TC_UI_003 - Verify products sorted Z to A", async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    const productsPage = new ProductsPage(page);
    await expect(productsPage.title).toBeVisible();

    // Sort Z to A
    await productsPage.sortBy("za");

    // Get displayed product names
    const displayedNames = await productsPage.getAllProductNames();

    // Create expected order: sort alphabetically then reverse
    const expectedNames = [...displayedNames].sort().reverse();

    expect(displayedNames).toEqual(expectedNames);
  });
});
