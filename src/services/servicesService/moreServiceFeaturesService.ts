"use client";

import { MoreServiceFeaturesData } from "../../types/servicesTypes/moreServiceFeatures";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const moreServiceFeaturesService = {
  // Get service features data
  async getServiceFeatures(): Promise<MoreServiceFeaturesData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/service/moreservicefeatures`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching more service features:", error);
      throw error;
    }
  },

  // Update more service features title and content
  async updateMoreServiceFeatures(
    sliderId: string,
    titleArabic: string,
    titleEnglish: string,
    contentArabic: string,
    contentEnglish: string
  ): Promise<MoreServiceFeaturesData> {
    try {
      const requestBody = {
        title: JSON.stringify({
          arabic: titleArabic,
          english: titleEnglish,
        }),
        content: JSON.stringify({
          arabic: contentArabic,
          english: contentEnglish,
        }),
      };

      const response = await fetch(
        `${API_BASE_URL}/section/updateslider/${sliderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating more service features:", error);
      throw error;
    }
  },

  // Add new slide
  async addSlide(
    sliderId: string,
    image: File,
    arabic: { title: string; content: string },
    english: { title: string; content: string },
    text?: string
  ): Promise<MoreServiceFeaturesData> {
    try {
      const formData = new FormData();
      formData.append("arabic", JSON.stringify(arabic));
      formData.append("english", JSON.stringify(english));
      formData.append("image", image);
      if (text) formData.append("text", text);

      const response = await fetch(
        `${API_BASE_URL}/section/slider/addtoslider/${sliderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch {
      throw new Error("Failed to add slide");
    }
  },

  // Update existing slide
  async updateSlide(
    slideId: string,
    image?: File,
    arabicTitle?: string,
    englishTitle?: string,
    arabicContent?: string,
    englishContent?: string,
    text?: string
  ): Promise<MoreServiceFeaturesData> {
    try {
      const formData = new FormData();
      const data = {
        arabic: {
          title: arabicTitle || "",
          content: arabicContent || "",
        },
        english: {
          title: englishTitle || "",
          content: englishContent || "",
        },
      };
      formData.append("arabic", JSON.stringify(data.arabic));
      formData.append("english", JSON.stringify(data.english));
      if (text !== undefined) formData.append("text", text);
      if (image) formData.append("image", image);

      const response = await fetch(
        `${API_BASE_URL}/section/slider/updateoneslide/service/moreservicefeatures/${slideId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`error: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch {
      throw new Error("Failed to update slide");
    }
  },

  // Delete slide
  async deleteSlide(slideId: string): Promise<MoreServiceFeaturesData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/service/moreservicefeatures/${slideId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch {
      throw new Error("Failed to delete slide");
    }
  },
};
