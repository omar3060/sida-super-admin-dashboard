"use client";

import {
  SidaOffersLanguage,
  SidaOffersSlider,
  ParsedSidaOffersSlider,
} from "../../types/homeTypes/sidaoffers";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

  
export const getSidaOffersSlider =
  async (): Promise<ParsedSidaOffersSlider> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/section/slider/home/sidaoffers`,
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
      const sliderData: SidaOffersSlider = responseData.slider || responseData;
      const parsedData: ParsedSidaOffersSlider = {
        ...sliderData,
        title:
          typeof sliderData.title === "string"
            ? sliderData.title
            : sliderData.title,
        content:
          typeof sliderData.content === "string"
            ? sliderData.content
            : sliderData.content,
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
): Promise<ParsedSidaOffersSlider> => {
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
    return await getSidaOffersSlider();
  } catch (error) {
    throw error;
  }
};


export const addSlide = async (
  sliderId: string,
  image: File,
  arabic: SidaOffersLanguage,
  english: SidaOffersLanguage
): Promise<ParsedSidaOffersSlider> => {
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
    return await getSidaOffersSlider();
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
  englishContent?: string,
  text?: string
): Promise<ParsedSidaOffersSlider> => {
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
      `${API_BASE_URL}/section/slider/updateoneslide/home/sidaoffers/${slideId}`,
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

    return await getSidaOffersSlider();
  } catch (error) {
    throw error;
  }
};


export const deleteSlide = async (
  slideId: string
): Promise<ParsedSidaOffersSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/home/sidaoffers/${slideId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }
    return await getSidaOffersSlider();
  } catch (error) {
    throw error;
  }
};
