import { APIRequestContext } from "@playwright/test";

const BASE_URL = "https://simple-books-api.glitch.me";

export class BooksApiClient {
  private request: APIRequestContext;
  private token: string = "";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async authenticate(clientName: string, clientEmail: string) {
    const response = await this.request.post(`${BASE_URL}/api-clients/`, {
      data: {
        clientName,
        clientEmail,
      },
    });
    const body = await response.json();
    this.token = body.accessToken;
    return { response, body };
  }

  async createOrder(bookId: number, customerName: string) {
    const response = await this.request.post(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data: {
        bookId,
        customerName,
      },
    });
    const body = await response.json();
    return { response, body };
  }

  async getOrder(orderId: string) {
    const response = await this.request.get(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    let body = null;
    try {
      body = await response.json();
    } catch {
      // 204 or empty responses won't have JSON
    }
    return { response, body };
  }

  async updateOrder(orderId: string, customerName: string) {
    const response = await this.request.patch(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data: {
        customerName,
      },
    });
    return { response };
  }

  async deleteOrder(orderId: string) {
    const response = await this.request.delete(
      `${BASE_URL}/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return { response };
  }
}
