import {
  FeatureTableSliderResponse,
  AddFeatureTableSlideRequest,
  UpdateFeatureTableSlideRequest,
} from "@/types/homeTypes/featuresTableSlider";

const BASE_URL = "https://super-admin-eta.vercel.app";

export const featuresTableSliderService = { 
  getSlider: async (): Promise<FeatureTableSliderResponse> => {
    const response = await fetch(
      `${BASE_URL}/section/slider/home/featurestables`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch features table slider");
    }
    return response.json();
  },

  addSlide: async (
    sliderId: string,
    slideData: AddFeatureTableSlideRequest
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append("arabic", slideData.arabic);
    formData.append("english", slideData.english);
    formData.append("image", slideData.image);

    const response = await fetch(`${BASE_URL}/section/slider/addtoslider/${sliderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to add slide");
    }
    return response.json();
  },

  updateSlide: async (
    slideId: string,
    slideData: UpdateFeatureTableSlideRequest
  ): Promise<{ message: string }> => {
    const formData = new FormData();

    if (slideData.arabic) {
      formData.append("arabic", slideData.arabic);
    }
    if (slideData.english) {
      formData.append("english", slideData.english);
    }
    if (slideData.image) {
      formData.append("image", slideData.image);
    }

    const response = await fetch(
      `${BASE_URL}/section/slider/updateoneslide/home/featurestables/${slideId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update slide");
    }
    return response.json();
  },

  deleteSlide: async (slideId: string): Promise<{ message: string }> => {
    const response = await fetch(
      `${BASE_URL}/section/slider/home/featurestables/${slideId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete slide");
    }
    return response.json();
  },
};
