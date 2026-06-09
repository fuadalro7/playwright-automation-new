import { test, expect } from "@playwright/test";
import { BooksApiClient } from "../../src/api/BooksApiClient";
import { randomEmail } from "../../src/utils/random";
import apiData from "../../src/data/api-data.json";

// These tests run in serial order since they depend on each other
test.describe.serial("Simple Books API Tests", () => {
  let apiClient: BooksApiClient;
  let orderId: string;

  test.beforeAll(async ({ request }) => {
    apiClient = new BooksApiClient(request);
  });

  test("TC_API_001 - Authenticate and Create Order", async () => {
    // Register with dynamic email
    const email = randomEmail();
    const authResult = await apiClient.authenticate(apiData.clientName, email);
    expect(authResult.response.status()).toBe(201);
    expect(authResult.body.accessToken).toBeTruthy();

    // Create order
    const orderResult = await apiClient.createOrder(
      apiData.bookId,
      apiData.customerName
    );
    expect(orderResult.response.status()).toBe(201);
    expect(orderResult.body.created).toBe(true);
    expect(orderResult.body.orderId).toBeTruthy();

    // Store for subsequent tests
    orderId = orderResult.body.orderId;
  });

  test("TC_API_002 - Fetch Order Details", async () => {
    const { response, body } = await apiClient.getOrder(orderId);

    expect(response.status()).toBe(200);
    expect(body.bookId).toBe(apiData.bookId);
    expect(body.customerName).toBe(apiData.customerName);
  });

  test("TC_API_003 - Update Order Customer Name", async () => {
    // Update customer name
    const updateResult = await apiClient.updateOrder(
      orderId,
      apiData.updatedCustomerName
    );
    expect(updateResult.response.status()).toBe(204);

    // Verify the update
    const { response, body } = await apiClient.getOrder(orderId);
    expect(response.status()).toBe(200);
    expect(body.customerName).toBe(apiData.updatedCustomerName);
  });

  test("TC_API_004 - Delete Order and Verify 404", async () => {
    // Delete the order
    const deleteResult = await apiClient.deleteOrder(orderId);
    expect(deleteResult.response.status()).toBe(204);

    // Verify it's gone
    const { response } = await apiClient.getOrder(orderId);
    expect(response.status()).toBe(404);
  });
});
