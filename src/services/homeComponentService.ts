import {
  HomeComponent,
  HomeComponentOrder,
  HomeComponentUpdate,
} from "@/types/homeComponent";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://super-admin-eta.vercel.app";

export const homeComponentService = {
  // Get all home components
  async getHomeComponents(): Promise<HomeComponent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/home-components`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.homeComponents || data;
    } catch (error) {
      console.error("Error fetching home components:", error);
      throw error;
    }
  },

  // Update component order
  async updateComponentOrder(
    componentId: string,
    order: number
  ): Promise<HomeComponent> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/home-components/${componentId}/order`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating component order:", error);
      throw error;
    }
  },

  // Toggle component visibility
  async toggleComponentVisibility(
    componentId: string,
    isActive: boolean
  ): Promise<HomeComponent> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/home-components/${componentId}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error toggling component visibility:", error);
      throw error;
    }
  },

  // Update multiple components order
  async updateMultipleComponentsOrder(
    components: HomeComponentOrder[]
  ): Promise<HomeComponent[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/home-components/bulk-order`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ components }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.homeComponents || data;
    } catch (error) {
      console.error("Error updating multiple components order:", error);
      throw error;
    }
  },

  // Initialize default components (for first time setup)
  async initializeDefaultComponents(): Promise<HomeComponent[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/home-components/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.homeComponents || data;
    } catch (error) {
      console.error("Error initializing default components:", error);
      throw error;
    }
  },
};
