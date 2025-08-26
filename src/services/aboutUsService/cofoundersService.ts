"use client";

import {
  ParsedCofoundersSlider,
  CofoundersLanguage,
  CofoundersSlider,
} from "../../types/aboutUsTypes/cofounders";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const getCofoundersSlider =
  async (): Promise<ParsedCofoundersSlider> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/aboutus/cofounders`,
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
      const sliderData: CofoundersSlider = responseData.slider || responseData;

      let parsedTitle = { arabic: "", english: "" };
      try {
        if (sliderData.title) {
          parsedTitle = JSON.parse(sliderData.title);
        }
      } catch (error) {
        console.error("Failed to parse title:", sliderData.title);
        console.error("Parse error:", error);
        if (typeof sliderData.title === "object") {
          parsedTitle = sliderData.title as { arabic: string; english: string };
        }
      }

      // Parse the content JSON string
      let parsedContent = { arabic: "", english: "" };
      try {
        if (sliderData.content) {
          parsedContent = JSON.parse(sliderData.content);
        }
      } catch (error) {
        console.error("Failed to parse content:", sliderData.content);
        console.error("Parse error:", error);
        if (typeof sliderData.content === "object") {
          parsedContent = sliderData.content as {
            arabic: string;
            english: string;
          };
        }
      }

      const parsedData: ParsedCofoundersSlider = {
        ...sliderData,
        title: parsedTitle,
        content: parsedContent,
      };
      return parsedData;
    } catch (error) {
      throw error;
    }
  };

export const updateTitleContent = async (
  sliderId: string,
  title: { arabic: string; english: string },
  content: { arabic: string; english: string }
): Promise<ParsedCofoundersSlider> => {
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
    return await getCofoundersSlider();
  } catch (error) {
    throw error;
  }
};

export const addSlide = async (
  sliderId: string,
  image: File,
  arabic: CofoundersLanguage,
  english: CofoundersLanguage
): Promise<ParsedCofoundersSlider> => {
  try {
    const formData = new FormData();
    formData.append("arabic", JSON.stringify(arabic));
    formData.append("english", JSON.stringify(english));
    formData.append("image", image);

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
    return await getCofoundersSlider();
  } catch (error) {
    throw error;
  }
};

export const updateSlide = async (
  slideId: string,
  image?: File,
  arabicTitle?: string,
  englishTitle?: string,
  arabicContent?: string,
  englishContent?: string
): Promise<ParsedCofoundersSlider> => {
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
    if (image) formData.append("image", image);

    const response = await fetch(
      `${API_BASE_URL}/section/slider/updateoneslide/aboutus/cofounders/${slideId}`,
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
    return await getCofoundersSlider();
  } catch (error) {
    throw error;
  }
};
  
export const deleteSlide = async (
  slideId: string
): Promise<ParsedCofoundersSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/aboutus/cofounders/${slideId}`,
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
    return await getCofoundersSlider();
  } catch (error) {
    throw error;
  }
};
