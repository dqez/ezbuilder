const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const aiApi = {
  async chat(params: {
    chatId?: string;
    pageId: string;
    message: string;
    canvasState?: any;
  }) {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok || !response.body) {
      console.error(
        "Chat request failed:",
        response.status,
        response.statusText,
      );
      const text = await response.text();
      console.error("Response text:", text);
      throw new Error(
        `Chat request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.body;
  },

  async getChats(pageId: string) {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/ai/chats?pageId=${pageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async deleteChat(chatId: string) {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/ai/chats/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
