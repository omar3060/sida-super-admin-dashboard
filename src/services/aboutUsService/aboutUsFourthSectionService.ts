"use client";

import { AboutUsFourthSection } from "@/types/aboutUsTypes/aboutUsFourthSection";

const API_URL = "https://super-admin-eta.vercel.app/section/aboutus/valueadded";

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

    return responseData.section || responseData.slider || responseData;
  } catch {
    throw new Error("Invalid response format");
  }
};

export const aboutUsFourthSectionService = {
  getAboutUsFourthSection: async (): Promise<AboutUsFourthSection> => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      return await handleApiResponse(
        response,
        "fetch about us fourth section data"
      );
    } catch (error) {
      console.error("Fetch about us fourth section error:", error);
      throw error;
    }
  },

  updateAboutUsFourthSection: async (
    fourthSectionData: Partial<AboutUsFourthSection>,
    image?: File
  ): Promise<AboutUsFourthSection> => {
    try {
      const formData = new FormData();

      if (fourthSectionData.arabic) {
        formData.append("arabic", JSON.stringify(fourthSectionData.arabic));
      }

      if (fourthSectionData.english) {
        formData.append("english", JSON.stringify(fourthSectionData.english));
      }

      if (image) {
        formData.append("images", image);
      }

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: formData,
      });

      return await handleApiResponse(
        response,
        "update about us fourth section"
      );
    } catch (error) {
      console.error("Update about us fourth section error:", error);
      throw error;
    }
  },
};
