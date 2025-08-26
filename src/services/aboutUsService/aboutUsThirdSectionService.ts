"use client";

import { AboutUsThirdSection } from "@/types/aboutUsTypes/aboutUsThirdSection";

const API_URL = "https://super-admin-eta.vercel.app/section/aboutus/howwework";

const getAuthToken = (): string => {
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem("authToken");
    const envToken = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

    return localToken || envToken || "";
  }

  return process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN || "";
};

const createAuthHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

const handleApiResponse = async (response: Response, operation: string) => {
  const responseText = await response.text();

  if (!response.ok) {
    let errorMessage = `Failed to ${operation}`;

    try {
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage =
        responseText || `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  try {
    const responseData = JSON.parse(responseText);

    if (responseData.section) {
      return responseData.section;
    } else if (responseData.slider) {
      return responseData.slider;
    } else if (responseData.data) {
      return responseData.data;
    } else if (responseData.message && responseData.data) {
      return responseData.data;
    } else {
      return responseData;
    }
  } catch {
    throw new Error("Invalid response format");
  }
};

export const aboutUsThirdSectionService = {
  getAboutUsThirdSection: async (): Promise<AboutUsThirdSection> => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      return await handleApiResponse(
        response,
        "fetch about us third section data"
      );
    } catch (error) {
      console.error("Fetch about us third section error:", error);
      throw error;
    }
  },

  updateAboutUsThirdSection: async (
    thirdSectionData: Partial<AboutUsThirdSection>,
    image?: File
  ): Promise<AboutUsThirdSection> => {
    try {
      const formData = new FormData();

      if (thirdSectionData.arabic) {
        formData.append("arabic", JSON.stringify(thirdSectionData.arabic));
      }

      if (thirdSectionData.english) {
        formData.append("english", JSON.stringify(thirdSectionData.english));
      }

      if (image) {
        formData.append("images", image);
      }

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: formData,
      });

      return await handleApiResponse(response, "update about us third section");
    } catch (error) {
      console.error("Update about us third section error:", error);
      throw error;
    }
  },
};
