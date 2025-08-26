import { ImageComparisonResponse } from "../../types/homeTypes/imageComparison";

const BASE_URL = "https://super-admin-eta.vercel.app";

export const imageComparisonService = {
  getImageComparison: async (): Promise<ImageComparisonResponse> => {
    const response = await fetch(`${BASE_URL}/section/home/imagecomparison`);
    if (!response.ok) {
      throw new Error("Failed to fetch image comparison data");
    }
    return response.json();
  },

  updateImageComparison: async (
    sectionId: string,
    beforeImage?: File,
    afterImage?: File
  ): Promise<ImageComparisonResponse> => {
    const formData = new FormData();

    if (beforeImage) {
      formData.append("images", beforeImage);
    }
    if (afterImage) {
      formData.append("images", afterImage);
    }

    const response = await fetch(`${BASE_URL}/section/home/imagecomparison`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update image comparison");
    }
    return response.json();
  },
};
