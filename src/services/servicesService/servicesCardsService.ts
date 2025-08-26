"use client";

import {
  ParsedServicesCardsSlider,
  ServicesCardsLanguage,
  ServicesCardsSlider,
} from "../../types/servicesTypes/servicesCards";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const getServicesCardsSlider =
  async (): Promise<ParsedServicesCardsSlider> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/services/servicescards`,
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

      const responseData = await response.json();
      const sliderData: ServicesCardsSlider =
        responseData.slider || responseData;

      let parsedTitle = { arabic: "", english: "" };
      try {
        if (sliderData.title) {
          parsedTitle = JSON.parse(sliderData.title);
        }
      } catch {
        if (typeof sliderData.title === "object") {
          parsedTitle = sliderData.title as { arabic: string; english: string };
        }
      }

      let parsedContent = { arabic: "", english: "" };
      try {
        if (sliderData.content) {
          parsedContent = JSON.parse(sliderData.content);
        }
      } catch {
        if (typeof sliderData.content === "object") {
          parsedContent = sliderData.content as {
            arabic: string;
            english: string;
          };
        }
      }

      const parsedData: ParsedServicesCardsSlider = {
        ...sliderData,
        title: parsedTitle,
        content: parsedContent,
      };
      return parsedData;
      } catch {
      throw new Error("Failed to get services cards slider");
    }
  };

export const updateTitleContent = async (
  sliderId: string,
  title: { arabic: string; english: string },
  content: { arabic: string; english: string }
): Promise<ParsedServicesCardsSlider> => {
  try {
    const requestBody = {
      title: JSON.stringify(title),
      content: JSON.stringify(content),
    };
    const response = await fetch(
      `${API_BASE_URL}/section/updateslider/${sliderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${TOKEN}`,
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
    return await getServicesCardsSlider();
  } catch {
    throw new Error("Failed to update title and content");
  }
};

export const addSlide = async (
  sliderId: string,
  image: File,
  arabic: ServicesCardsLanguage,
  english: ServicesCardsLanguage,
  text?: string
): Promise<ParsedServicesCardsSlider> => {
  try {
    const formData = new FormData();
    formData.append("arabic", JSON.stringify(arabic));
    formData.append("english", JSON.stringify(english));
    formData.append("image", image);
    if (text) formData.append("text", text);

    const response = await fetch(`${API_BASE_URL}/section/slider/addtoslider/${sliderId}`, {
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
    return await getServicesCardsSlider();
  } catch {
    throw new Error("Failed to add slide");
  }
};

export const updateSlide = async (
  slideId: string,
  image?: File,
  arabicTitle?: string,
  englishTitle?: string,
  arabicContent?: string,
  englishContent?: string,
  text?: string
): Promise<ParsedServicesCardsSlider> => {
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
      `${API_BASE_URL}/section/slider/updateoneslide/services/servicescards/${slideId}`,
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
    return await getServicesCardsSlider();
  } catch {
    throw new Error("Failed to update slide");
  }
};

export const deleteSlide = async (
  slideId: string
): Promise<ParsedServicesCardsSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/services/servicescards/${slideId}`,
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
    return await getServicesCardsSlider();
    } catch {
    throw new Error("Failed to delete slide");
  }
};
