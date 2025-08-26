"use client";

import { AboutUsCidaCircle } from "@/types/aboutUsTypes/aboutUsCidaCircle";

const API_URL =
  "https://super-admin-eta.vercel.app/section/aboutus/cidacircledata";

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

export const aboutUsCidaCircleService = {
  getAboutUsCidaCircle: async (): Promise<AboutUsCidaCircle> => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      return await handleApiResponse(
        response,
        "fetch about us sida circle data"
      );
    } catch (error) {
      console.error("Fetch about us sida circle error:", error);
      throw error;
    }
  },

  updateAboutUsCidaCircle: async (
    cidaCircleData: Partial<AboutUsCidaCircle>
  ): Promise<AboutUsCidaCircle> => {
    try {
      const formData = new FormData();

      if (cidaCircleData.arabic) {
        formData.append("arabic", JSON.stringify(cidaCircleData.arabic));
      }

      if (cidaCircleData.english) {
        formData.append("english", JSON.stringify(cidaCircleData.english));
      }

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: formData,
      });

      return await handleApiResponse(
        response,
        "update about us sida circle data"
      );
    } catch (error) {
      console.error("Update about us sida circle error:", error);
      throw error;
    }
  },
};
