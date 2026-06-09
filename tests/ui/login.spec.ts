import { test, expect } from "@playwright/test";
import { LoginPage, ProductsPage } from "../../src/pages";
import testData from "../../src/data/test-data.json";

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("TC_UI_001 - Valid Login", async ({ page }) => {
    const { username, password } = testData.validUser;
    await loginPage.login(username, password);

    const productsPage = new ProductsPage(page);
    await expect(productsPage.title).toBeVisible();
    expect(await productsPage.getTitle()).toBe("Products");
    expect(page.url()).toContain("/inventory.html");
  });

  for (const scenario of testData.invalidLoginScenarios) {
    test(`TC_UI_002 - Invalid Login: ${scenario.scenario}`, async () => {
      await loginPage.login(scenario.username, scenario.password);

      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toBe(scenario.expectedError);
    });
  }
});
