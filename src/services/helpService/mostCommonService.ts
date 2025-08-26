"use client";

import { MostCommonData } from "@/types/helpTypes/mostCommon";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const mostCommonService = {
  async getMostCommon(): Promise<MostCommonData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/help/mostcommon`,
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
      console.error("Error fetching most common data:", error);
      throw error;
    }
  },

  async updateMostCommon(
    sliderId: string,
    titleArabic: string,
    titleEnglish: string,
  ): Promise<MostCommonData> {
    try {
      const requestBody = {
        title: JSON.stringify({
          arabic: titleArabic,
          english: titleEnglish,
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
      console.error("Error updating most common:", error);
      throw error;
    }
  },

  async addSlide(
    sliderId: string,
    image: File,
    arabic: { title: string },
    english: { title: string },
    text?: string
  ): Promise<MostCommonData> {
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
    } catch (error) {
      console.error("Error adding slide:", error);
      throw error;
    }
  },

  async updateSlide(
    slideId: string,
    image?: File,
    arabicTitle?: string,
    englishTitle?: string,
    text?: string
  ): Promise<MostCommonData> {
    try {
      const formData = new FormData();
      const data = {
        arabic: {
          title: arabicTitle || "",
        },
        english: {
          title: englishTitle || "",
        },
      };
      formData.append("arabic", JSON.stringify(data.arabic));
      formData.append("english", JSON.stringify(data.english));
      if (text !== undefined) formData.append("text", text);
      if (image) formData.append("image", image);

      const response = await fetch(
        `${API_BASE_URL}/section/slider/updateoneslide/help/mostcommon/${slideId}`,
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
    } catch (error) {
      console.error("Error updating slide:", error);
      throw error;
    }
  },

  async deleteSlide(slideId: string): Promise<MostCommonData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/help/mostcommon/${slideId}`,
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
    } catch (error) {
      console.error("Error deleting slide:", error);
      throw error;
    }
  },
};
