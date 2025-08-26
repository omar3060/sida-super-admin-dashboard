"use client";

import {
  FooterSection,
  FooterLink,
  FooterLinksResponse,
  SocialLink,
  SocialLinksResponse,
} from "@/types/homeTypes/footer";

// API Configuration
const FOOTER_SECTION_URL =
  "https://super-admin-eta.vercel.app/section/home/footer";
const FOOTER_LINKS_URL = "https://super-admin-eta.vercel.app/footer";
const SOCIAL_LINKS_URL = "https://super-admin-eta.vercel.app/footer/social";

const getFooterAddLinkUrl = (category: string) => {
  return `https://super-admin-eta.vercel.app/footer/${category}`;
};

// Authentication
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

// Error Handling
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

    // Handle different response structures
    if (responseData.section) {
      return responseData.section;
    } else if (responseData.slider) {
      return responseData.slider;
    } else if (responseData.data) {
      return responseData.data;
    } else if (responseData.message && responseData.data) {
      return responseData.data;
    } else {
      // If no specific structure, return the whole response
      return responseData;
    }
  } catch {
    throw new Error("Invalid response format");
  }
};

const handleFooterLinksResponse = async (
  response: Response,
  operation: string
) => {
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

    if (
      operation.includes("add") &&
      (!responseData || Object.keys(responseData).length === 0)
    ) {
      return {
        _id: `temp_${Date.now()}`,
        ...responseData,
      };
    }

    return responseData;
  } catch {
    if (operation.includes("add") && responseText.trim() === "") {
      return {
        _id: `temp_${Date.now()}`,
        success: true,
      };
    }
    throw new Error("Invalid response format");
  }
};

const handleSocialLinksResponse = async (
  response: Response,
  operation: string
) => {
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

    if (
      operation.includes("add") &&
      (!responseData || Object.keys(responseData).length === 0)
    ) {
      return {
        _id: `temp_${Date.now()}`,
        ...responseData,
      };
    }

    return responseData;
  } catch {
    if (operation.includes("add") && responseText.trim() === "") {
      return {
        _id: `temp_${Date.now()}`,
        success: true,
      };
    }
    throw new Error("Invalid response format");
  }
};

// Footer Section Service
export const footerSectionService = {
  getFooterSection: async (): Promise<FooterSection> => {
    try {
      const response = await fetch(FOOTER_SECTION_URL, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      return await handleApiResponse(response, "fetch footer section data");
    } catch (error) {
      throw error;
    }
  },

  updateFooterSection: async (
    footerData: Partial<FooterSection>,
    images?: File[]
  ): Promise<FooterSection> => {
    try {
      const formData = new FormData();

      if (footerData.arabic) {
        formData.append("arabic", JSON.stringify(footerData.arabic));
      }
      if (footerData.english) {
        formData.append("english", JSON.stringify(footerData.english));
      }

      if (images) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await fetch(FOOTER_SECTION_URL, {
        method: "PUT",
        headers: {
          ...createAuthHeaders(),
        },
        body: formData,
      });

      return await handleApiResponse(response, "update footer section data");
    } catch (error) {
      throw error;
    }
  },
};

// Footer Links Service
export const footerLinksService = {
  getFooterLinks: async (): Promise<FooterLinksResponse> => {
    try {
      const response = await fetch(FOOTER_LINKS_URL, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      throw error;
    }
  },

  addFooterLink: async (
    linkData: Omit<FooterLink, "_id" | "__v">
  ): Promise<FooterLink> => {
    try {
      const addUrl = getFooterAddLinkUrl(linkData.category);
      const { ...linkDataWithoutCategory } = linkData;

      const response = await fetch(addUrl, {
        method: "POST",
        headers: {
          ...createAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkDataWithoutCategory),
      });

      return await handleFooterLinksResponse(response, "add footer link");
    } catch (error) {
      throw error;
    }
  },

  updateFooterLink: async (
    linkId: string,
    linkData: Partial<FooterLink>
  ): Promise<FooterLink> => {
    try {
      const { ...linkDataWithoutCategory } = linkData;
      const updateUrl = `${FOOTER_LINKS_URL}/${linkId}`;

      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          ...createAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkDataWithoutCategory),
      });

      return await handleFooterLinksResponse(response, "update footer link");
    } catch (error) {
      throw error;
    }
  },

  deleteFooterLink: async (linkId: string): Promise<void> => {
    try {
      const deleteUrl = `${FOOTER_LINKS_URL}/${linkId}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  },
};

// Social Media Links Service
export const socialLinksService = {
  getSocialLinks: async (): Promise<SocialLinksResponse> => {
    try {
      const response = await fetch(SOCIAL_LINKS_URL, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      throw error;
    }
  },

  addSocialLink: async (
    linkData: Omit<SocialLink, "_id" | "__v">
  ): Promise<SocialLink> => {
    try {
      const cleanLinkData = {
        link: linkData.link,
        icon: linkData.icon,
        display: linkData.display,
      };

      const response = await fetch(SOCIAL_LINKS_URL, {
        method: "POST",
        headers: {
          ...createAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanLinkData),
      });

      return await handleSocialLinksResponse(response, "add social link");
    } catch (error) {
      throw error;
    }
  },

  updateSocialLink: async (
    linkId: string,
    linkData: Partial<SocialLink>
  ): Promise<SocialLink> => {
    try {
      const cleanLinkData = {
        link: linkData.link,
        icon: linkData.icon,
        display: linkData.display,
      };

      const updateUrl = `${SOCIAL_LINKS_URL}/${linkId}`;

      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          ...createAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanLinkData),
      });

      return await handleSocialLinksResponse(response, "update social link");
    } catch (error) {
      throw error;
    }
  },

  deleteSocialLink: async (linkId: string): Promise<void> => {
    try {
      const deleteUrl = `${SOCIAL_LINKS_URL}/${linkId}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Failed to delete social link`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage =
            responseText || `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw error;
    }
  },
};
