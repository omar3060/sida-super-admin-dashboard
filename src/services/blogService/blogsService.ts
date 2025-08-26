"use client";

import {
  BlogsLanguage,
  BlogsSlider,
  ParsedBlogsSlider,
} from "@/types/blogTypes/blogs";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const getBlogsSlider = async (): Promise<ParsedBlogsSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/blogs/allblogs`,
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
    const sliderData: BlogsSlider = responseData.slider || responseData;
    const parsedData: ParsedBlogsSlider = {
      ...sliderData,
      title:
        typeof sliderData.title === "string"
          ? { arabic: sliderData.title, english: sliderData.title }
          : sliderData.title,
      content:
        typeof sliderData.content === "string"
          ? { arabic: sliderData.content, english: sliderData.content }
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
): Promise<ParsedBlogsSlider> => {
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
    return await getBlogsSlider();
  } catch (error) {
    throw error;
  }
};

export const addSlide = async (
  sliderId: string,
  image: File,
  arabic: BlogsLanguage,
  english: BlogsLanguage
): Promise<ParsedBlogsSlider> => {
  try {
    const formData = new FormData();
    formData.append("arabic", JSON.stringify(arabic));
    formData.append("english", JSON.stringify(english));
    formData.append("image", image);

    const response = await fetch(
      `${API_BASE_URL}/section/slider/addtoslider/${sliderId}`,
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
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }

    return await getBlogsSlider();
  } catch (error) {
    throw error;
  }
};

export const updateSlide = async (
  sliderId: string,
  slideId: string,
  image: File,
  arabic: BlogsLanguage,
  english: BlogsLanguage
): Promise<ParsedBlogsSlider> => {
  try {
    const formData = new FormData();
    formData.append("arabic", JSON.stringify(arabic));
    formData.append("english", JSON.stringify(english));
    formData.append("image", image);

    const response = await fetch(
      `${API_BASE_URL}/section/slider/updateslide/${sliderId}/${slideId}`,
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
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }

    return await getBlogsSlider();
  } catch (error) {
    throw error;
  }
};

export const deleteSlide = async (
  sliderId: string,
  slideId: string
): Promise<ParsedBlogsSlider> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/slider/deleteslide/${sliderId}/${slideId}`,
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

    return await getBlogsSlider();
  } catch (error) {
    throw error;
  }
};
