import { test, expect } from "@playwright/test";
import { LoginPage, ProductsPage, CartPage, CheckoutPage } from "../../src/pages";
import testData from "../../src/data/test-data.json";

test.describe("Checkout Tests", () => {
  test("TC_UI_004 - End-to-End Checkout Flow", async ({ page }) => {
    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    // Step 2: Verify products page
    const productsPage = new ProductsPage(page);
    await expect(productsPage.title).toBeVisible();
    expect(await productsPage.getTitle()).toBe("Products");

    // Step 3: Add the two most expensive products
    await productsPage.addMostExpensiveProducts(2);

    // Verify cart badge shows 2
    await expect(productsPage.cartBadge).toHaveText("2");

    // Step 4: Go to cart and checkout
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    expect(await cartPage.getItemCount()).toBe(2);
    await cartPage.checkout();

    // Step 5: Fill checkout info
    const checkoutPage = new CheckoutPage(page);
    const { firstName, lastName, postalCode } = testData.checkoutInfo;
    await checkoutPage.fillInfo(firstName, lastName, postalCode);

    // Step 6: Verify item total is correct
    const individualPrices = await checkoutPage.getIndividualPrices();
    const expectedTotal = individualPrices.reduce((sum, p) => sum + p, 0);
    const displayedTotal = await checkoutPage.getItemTotal();

    // Compare with tolerance for floating point
    expect(Math.abs(displayedTotal - expectedTotal)).toBeLessThan(0.01);

    // Step 7: Finish and verify confirmation
    await checkoutPage.finish();

    const header = await checkoutPage.getConfirmationHeader();
    expect(header).toBe("Thank you for your order!");

    const text = await checkoutPage.getConfirmationText();
    expect(text).toContain("Your order has been dispatched");
  });
});
