"use client";

import { ServiceFeaturesData } from "../../types/servicesTypes/serviceFeatures";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const serviceFeaturesService = {
  // Get service features data
  async getServiceFeatures(): Promise<ServiceFeaturesData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/service/servicefeatures`,
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
      console.error("Error fetching service features:", error);
      throw error;
    }
  },

  // Update service features title and content
  async updateServiceFeatures(
    sliderId: string,
    titleArabic: string,
    titleEnglish: string,
    contentArabic: string,
    contentEnglish: string
  ): Promise<ServiceFeaturesData> {
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
      console.error("Error updating service features:", error);
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
  ): Promise<ServiceFeaturesData> {
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
  ): Promise<ServiceFeaturesData> {
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
        `${API_BASE_URL}/section/slider/updateoneslide/service/servicefeatures/${slideId}`,
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
  async deleteSlide(slideId: string): Promise<ServiceFeaturesData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/service/servicefeatures/${slideId}`,
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
