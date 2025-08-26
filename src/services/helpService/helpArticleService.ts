"use client";

import {
  HelpArticlesResponse,
  HelpArticleData,
} from "@/types/helpTypes/helpArticle";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const helpArticleService = {
  async getHelpArticles(): Promise<HelpArticlesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/help`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching help articles:", error);
      throw error;
    }
  },

  async addHelpArticle(
    article: { arabic: string; english: string },
    arabic: { title: string; content: string; steps: string[] },
    english: { title: string; content: string; steps: string[] },
    cover?: File,
    image?: File,
    vedio?: File
  ): Promise<HelpArticleData> {
    try {
      const formData = new FormData();
      formData.append("article", JSON.stringify(article));
      formData.append("arabic", JSON.stringify(arabic));
      formData.append("english", JSON.stringify(english));
      if (cover) formData.append("cover", cover);
      if (image) formData.append("image", image);
      if (vedio) formData.append("vedio", vedio);

      const response = await fetch(`${API_BASE_URL}/help`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding help article:", error);
      throw error;
    }
  },

  async updateHelpArticle(
    articleId: string,
    article: { arabic: string; english: string },
    arabic: { title: string; content: string; steps: string[] },
    english: { title: string; content: string; steps: string[] },
    cover?: File,
    image?: File,
    vedio?: File
  ): Promise<HelpArticleData> {
    try {
      const formData = new FormData();
      formData.append("article", JSON.stringify(article));
      formData.append("arabic", JSON.stringify(arabic));
      formData.append("english", JSON.stringify(english));
      if (cover) formData.append("cover", cover);
      if (image) formData.append("image", image);
      if (vedio) formData.append("vedio", vedio);

      const response = await fetch(`${API_BASE_URL}/help/${articleId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating help article:", error);
      throw error;
    }
  },

  async deleteHelpArticle(articleId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/help/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`error: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting help article:", error);
      throw error;
    }
  },
};
