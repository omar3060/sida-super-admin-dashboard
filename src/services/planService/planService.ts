"use client";

import { Plan } from "@/types/plansTypes/plan";

const API_URL = "https://super-admin-eta.vercel.app/plan";

const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const planService = {
  getPlans: async () => {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch plans");
    return response.json();
  },

  createPlan: async (plan: Plan) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(plan),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Failed to create plan");
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  },

  updatePlan: async (id: string, plan: Plan) => {
    const { ...cleanPlan } = plan;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(cleanPlan),
      });

      const responseText = await response.text();

      if (!response.ok) {
        if (responseText.includes("plan name already exists")) {
          const { english, arabic, ...planWithoutNames } = cleanPlan;
          const planWithoutNamesButWithContent = {
            ...planWithoutNames,
            english: {
              description: english.description,
              features: english.features,
            },
            arabic: {
              description: arabic.description,
              features: arabic.features,
            },
          };

          const retryResponse = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(planWithoutNamesButWithContent),
          });

          const retryResponseText = await retryResponse.text();

          if (!retryResponse.ok) {
            throw new Error(
              retryResponseText ||
                `HTTP ${retryResponse.status}: ${retryResponse.statusText}`
            );
          }

          let retryResponseData;
          try {
            retryResponseData = JSON.parse(retryResponseText);
          } catch {
            retryResponseData = retryResponseText;
          }

          return retryResponseData;
        }

        let errorMessage = "Failed to update plan";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            errorData.message ||
            errorData.error ||
            errorData.errors?.join(", ") ||
            errorMessage;
        } catch {
          errorMessage =
            responseText || `HTTP ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      return responseData;
    } catch {
      throw new Error("Failed to update plan");
    }
  },

  deletePlan: async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete plan");
    return response.json();
  },
};
