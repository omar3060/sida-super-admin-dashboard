"use client";

import {
  ParsedLeadersSlider,
  LeadersLanguage,
  LeadersSlider,
} from "../../types/aboutUsTypes/leaders";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const getLeadersSlider = async (): Promise<ParsedLeadersSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/aboutus/ourleaders`,
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
    const sliderData: LeadersSlider = responseData.slider || responseData;

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

    const parsedData: ParsedLeadersSlider = {
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
): Promise<ParsedLeadersSlider> => {
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
    return await getLeadersSlider();
  } catch (error) {
    throw error;
  }
};

export const addSlide = async (
  sliderId: string,
  image: File,
  arabic: LeadersLanguage,
  english: LeadersLanguage
): Promise<ParsedLeadersSlider> => {
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
    return await getLeadersSlider();
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
): Promise<ParsedLeadersSlider> => {
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
      `${API_BASE_URL}/section/slider/updateoneslide/aboutus/ourleaders/${slideId}`,
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
    return await getLeadersSlider();
  } catch (error) {
    throw error;
  }
};

export const deleteSlide = async (
  slideId: string
): Promise<ParsedLeadersSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/aboutus/ourleaders/${slideId}`,
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
    return await getLeadersSlider();
  } catch (error) {
    throw error;
  }
};
