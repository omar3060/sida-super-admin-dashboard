import {
  Blog,
  BlogsResponse,
  BlogFormData,
  SectionFormData,
} from "@/types/blogTypes/blog";

const API_BASE_URL = "https://super-admin-eta.vercel.app";
const TOKEN = process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN;


export const getAllBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlogsResponse = await response.json();
    return data.blogs;
  } catch (error) {
    throw error;
  }
};


export const getBlogById = async (blogId: string): Promise<Blog> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.blog || data;
  } catch (error) {
    throw error;
  }
};


export const addBlog = async (
  blogData: BlogFormData,
  image?: File
): Promise<Blog> => {
  try {
    const formData = new FormData();
    formData.append("text", blogData.text);
    formData.append("sections", JSON.stringify(blogData.sections));

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${API_BASE_URL}/blog/`, {
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

    const data = await response.json();
    return data.blog || data;
  } catch (error) {
    throw error;
  }
};


export const updateBlog = async (
  blogId: string,
  blogData: Partial<BlogFormData>,
  image?: File
): Promise<Blog> => {
  try {
    const formData = new FormData();

    if (blogData.text !== undefined) {
      formData.append("text", blogData.text);
    }

    if (blogData.sections !== undefined) {
      formData.append("sections", JSON.stringify(blogData.sections));
    }

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
      method: "PUT",
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

    const data = await response.json();
    return data.blog || data;
  } catch (error) {
    throw error;
  }
};


export const addSectionToBlog = async (
  blogId: string,
  sectionData: SectionFormData
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("title", JSON.stringify(sectionData.title));
    formData.append("content", JSON.stringify(sectionData.content));

    const response = await fetch(`${API_BASE_URL}/blog/${blogId}/section`, {
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
  } catch (error) {
    throw error;
  }
};


export const updateSection = async (
  blogId: string,
  sectionId: string,
  sectionData: SectionFormData
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/blog/${blogId}/section/${sectionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sectionData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }
  } catch (error) {
    throw error;
  }
};


export const deleteSection = async (
  blogId: string,
  sectionId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/blog/${blogId}/section/${sectionId}`,
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
  } catch (error) {
    throw error;
  }
};


export const deleteBlog = async (blogId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }
  } catch (error) {
    throw error;
  }
};


