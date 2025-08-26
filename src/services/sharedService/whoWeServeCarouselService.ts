"use client";

import {
  ParsedWhoWeServeSlider,
  WhoWeServeLanguage,
  WhoWeServeSlider,
} from "../../types/sharedTypes/whoWeServeCarousel";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const getWhoWeServeSlider =
  async (): Promise<ParsedWhoWeServeSlider> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/home/whoweserve`,
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
      const sliderData: WhoWeServeSlider = responseData.slider || responseData;

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

      const parsedData: ParsedWhoWeServeSlider = {
        ...sliderData,
        title: parsedTitle,
      };
      return parsedData;
    } catch {
      throw new Error("Failed to get who we serve slider");
    }
  };

export const updateTitleContent = async (
  sliderId: string,
  title: { arabic: string; english: string }
): Promise<ParsedWhoWeServeSlider> => {
  try {
    const requestBody = {
      title: JSON.stringify(title),
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
    return await getWhoWeServeSlider();
  } catch {
    throw new Error("Failed to update title");
  }
};

export const addSlide = async (
  sliderId: string,
  image: File,
  arabic: WhoWeServeLanguage,
  english: WhoWeServeLanguage,
  text?: string
): Promise<ParsedWhoWeServeSlider> => {
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
    return await getWhoWeServeSlider();
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
): Promise<ParsedWhoWeServeSlider> => {
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
      `${API_BASE_URL}/section/slider/updateoneslide/home/whoweserve/${slideId}`,
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
    return await getWhoWeServeSlider();
  } catch {
    throw new Error("Failed to update slide");
  }
};

export const deleteSlide = async (
  slideId: string
): Promise<ParsedWhoWeServeSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/home/whoweserve/${slideId}`,
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

    return await getWhoWeServeSlider();
  } catch {
    throw new Error("Failed to delete slide");
  }
};
