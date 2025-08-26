"use client";

import {
  PartnersLanguage,
  PartnersSlider,
  ParsedPartnersSlider,
} from "../../types/homeTypes/partners";

const API_BASE_URL = "https://super-admin-eta.vercel.app";

const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const getPartnersSlider = async (): Promise<ParsedPartnersSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/home/partners`,
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

    const sliderData: PartnersSlider = responseData.slider || responseData;

    const parsedData: ParsedPartnersSlider = {
      ...sliderData,
      title:
        typeof sliderData.title === "string"
          ? JSON.parse(sliderData.title)
          : sliderData.title,
      content:
        typeof sliderData.content === "string"
          ? JSON.parse(sliderData.content)
          : sliderData.content,
    };

    return parsedData;
  } catch (error) {
    console.error("Error fetching partners slider:", error);
    throw error;
  }
};


export const updateTitleContent = async (
  sliderId: string,
  title: { arabic: string; english: string },
  content: { arabic: string; english: string }
): Promise<ParsedPartnersSlider> => {
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

    const responseText = await response.text();


    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${responseText}`
      );
    }

    return await getPartnersSlider();
  } catch (error) { 
    throw error;
  }
};

export const addSlide = async (
  slideId: string,
  image: File,
  title: PartnersLanguage,
  content: PartnersLanguage
): Promise<ParsedPartnersSlider> => {
  try {


    const formData = new FormData();

    formData.append(
      "arabic",
      JSON.stringify({
        title: title.arabic || "",
        content: content.arabic || "",
      })
    );

    formData.append(
      "english",
      JSON.stringify({
        title: title.english || "",
        content: content.english || "",
      })
    );

    formData.append("image", image);



    const response = await fetch(`${API_BASE_URL}/section/slider/addtoslider/${slideId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${responseText}`
      );
    }

    return await getPartnersSlider();
  } catch (error) {
    console.error("Error adding slide:", error);
    throw error;
  }
};

export const updateSlide = async (
  slideId: string,
  selectedFile: File | undefined,
  titleArabic: string,
  titleEnglish: string,
  contentArabic: string,
  contentEnglish: string,
  text: string
): Promise<ParsedPartnersSlider> => {
  try {
    const formData = new FormData();
    formData.append("titleArabic", titleArabic);
    formData.append("titleEnglish", titleEnglish);
    formData.append("contentArabic", contentArabic);
    formData.append("contentEnglish", contentEnglish);
    formData.append("text", text);
    if (selectedFile) formData.append("image", selectedFile);

    const response = await fetch(
      `${API_BASE_URL}/section/slider/home/partners/${slideId}`,
      {
        method: "PUT",
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

    return await getPartnersSlider();
  } catch (error) {
    console.error("Error updating slide:", error);
    throw error;
  }
};

export const deleteSlide = async (
  slideId: string
): Promise<ParsedPartnersSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/home/partners/${slideId}`,
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

    return await getPartnersSlider();
  } catch (error) {
    console.error("Error deleting slide:", error);
    throw error;
  }
};
