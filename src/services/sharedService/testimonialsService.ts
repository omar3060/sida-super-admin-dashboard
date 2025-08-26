"use client";

import {
  Testimonial,
  TestimonialLanguage,
  TestimonialHeader,
  TestimonialCard,
  TestimonialsResponse,
} from "../../types/sharedTypes/testimonials";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: TestimonialsResponse = await response.json();

    return responseData.testimonials;
  } catch {
    throw new Error("Failed to fetch testimonials");
  }
};

export const addTestimonial = async (
  image: File,
  arabic: TestimonialLanguage,
  english: TestimonialLanguage
): Promise<Testimonial[]> => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("arabic", JSON.stringify(arabic));
    formData.append("english", JSON.stringify(english));

    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }

    return await getTestimonials();
  } catch {
    throw new Error("Failed to add testimonial");
  }
};

export const updateTestimonial = async (
  testimonialId: string,
  image?: File,
  arabic?: TestimonialLanguage,
  english?: TestimonialLanguage
): Promise<Testimonial[]> => {
  try {
    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }
    if (arabic) {
      formData.append("arabic", JSON.stringify(arabic));
    }
    if (english) {
      formData.append("english", JSON.stringify(english));
    }

    const response = await fetch(
      `${API_BASE_URL}/testimonials/${testimonialId}`,
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
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }

    return await getTestimonials();
  } catch {
    throw new Error("Failed to update testimonial");
  }
};

export const deleteTestimonial = async (
  testimonialId: string
): Promise<Testimonial[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/testimonials/${testimonialId}`,
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

    return await getTestimonials();
  } catch {
    throw new Error("Failed to delete testimonial");
  }
};

export const separateTestimonials = (
  testimonials: Testimonial[]
): {
  header: TestimonialHeader | null;
  cards: TestimonialCard[];
} => {
  const headerIndex = testimonials.findIndex(
    (test) => test.arabic.name === "header" && test.english.name === "header"
  );

  if (headerIndex === -1) {
    return {
      header: null,
      cards: testimonials as TestimonialCard[],
    };
  }

  const testimonialsCopy = [...testimonials];
  const header = testimonialsCopy.splice(
    headerIndex,
    1
  )[0] as TestimonialHeader;
  const cards = testimonialsCopy as TestimonialCard[];

  return { header, cards };
};
