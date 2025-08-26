"use client";

import React, { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaEye,
  FaArrowLeft,
} from "react-icons/fa";
import { Blog, BlogSection, SectionFormData } from "@/types/blogTypes/blog";
import {
  getAllBlogs,
  addBlog,
  updateBlog,
  addSectionToBlog,
  updateSection,
  deleteSection,
  deleteBlog,
} from "@/services/blogService/blogService";

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);

  // View states
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  // Form states
  const [blogFormData, setBlogFormData] = useState<{
    text: string;
    sections: Omit<BlogSection, "_id">[];
  }>({
    text: "",
    sections: [],
  });

  const [sectionFormData, setSectionFormData] = useState<SectionFormData>({
    title: { arabic: "", english: "" },
    content: { arabic: [""], english: [""] },
  });

  // Editing states
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingSection, setEditingSection] = useState<{
    blogId: string;
    section: BlogSection;
  } | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number>(-1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // Reset form data
  const resetBlogForm = () => {
    setBlogFormData({
      text: "",
      sections: [],
    });
    setSelectedImage(null);
  };

  const resetSectionForm = () => {
    setSectionFormData({
      title: { arabic: "", english: "" },
      content: { arabic: [""], english: [""] },
    });
  };

  // Handle add new blog
  const handleAddBlog = () => {
    resetBlogForm();
    setShowAddModal(true);
  };

  const handleSaveBlog = async () => {
    try {
      setLoading(true);
      setError(null);

      if (editingBlog) {
        // For update, only send text and image, not sections
        const updateData = {
          text: blogFormData.text,
        };
        await updateBlog(
          editingBlog._id,
          updateData,
          selectedImage || undefined
        );

        // Since the API doesn't accept sections in updateBlog, we'll reload the blogs
        // to get the updated data from the database
        await loadBlogs();
      } else {
        // For new blog, image is optional
        await addBlog(blogFormData, selectedImage || undefined);
      }

      await loadBlogs();
      setShowAddModal(false);
      setShowEditModal(false);
      setEditingBlog(null);
      resetBlogForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit blog
  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogFormData({
      text: blog.text,
      sections: blog.sections.map(({ _id, ...section }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return section;
      }),
    });
    setShowEditModal(true);
  };

  // Handle view blog details
  const handleViewBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setViewMode("detail");
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode("list");
    setSelectedBlog(null);
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      setLoading(true);
      setError(null);
      await deleteBlog(blogId);
      await loadBlogs();
      if (selectedBlog && selectedBlog._id === blogId) {
        handleBackToList();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  // Handle add new section
  const handleAddSection = () => {
    // Allow adding sections for both new blogs and existing blogs
    resetSectionForm();
    setEditingSection(null);
    setEditingSectionIndex(-1);
    setShowSectionModal(true);
  };

  // Handle edit section
  const handleEditSection = (
    blogId: string,
    section: BlogSection | Omit<BlogSection, "_id">,
    index: number
  ) => {
    if (blogId && "_id" in section) {
      // Editing existing section from database
      setEditingSection({ blogId, section: section as BlogSection });
      setEditingSectionIndex(index);
      setSectionFormData({
        title: { ...section.title },
        content: { ...section.content },
      });
    } else {
      // Adding new section to current blog form
      setEditingSection(null);
      setEditingSectionIndex(-1);
      setSectionFormData({
        title: { arabic: "", english: "" },
        content: { arabic: [""], english: [""] },
      });
    }
    setShowSectionModal(true);
  };

  // Handle save section
  const handleSaveSection = async () => {
    try {
      setLoading(true);
      setError(null);

      if (editingSection && editingSectionIndex >= 0) {
        // Update existing section from database
        await updateSection(
          editingSection.blogId,
          editingSection.section._id,
          sectionFormData
        );

        // Update local state
        const updatedBlogs = blogs.map((blog) => {
          if (blog._id === editingSection.blogId) {
            const updatedSections = [...blog.sections];
            updatedSections[editingSectionIndex] = {
              ...editingSection.section,
              ...sectionFormData,
            };
            return { ...blog, sections: updatedSections };
          }
          return blog;
        });
        setBlogs(updatedBlogs);

        // Update selected blog if it's the same one
        if (selectedBlog && selectedBlog._id === editingSection.blogId) {
          const updatedBlog = updatedBlogs.find(
            (b) => b._id === editingSection.blogId
          );
          if (updatedBlog) setSelectedBlog(updatedBlog);
        }
      } else {
        // Add new section to current blog form (either new blog or existing blog)
        const newSection: Omit<BlogSection, "_id"> = {
          ...sectionFormData,
        };

        setBlogFormData((prev) => ({
          ...prev,
          sections: [...prev.sections, newSection],
        }));

        // If we're editing an existing blog, save the new section to the database
        if (editingBlog) {
          try {
            // Use the new endpoint to add section to existing blog
            await addSectionToBlog(editingBlog._id, sectionFormData);

            // Reload blogs to get the updated data from database
            await loadBlogs();

            // Update local state to reflect the new section
            const newSection: Omit<BlogSection, "_id"> = {
              ...sectionFormData,
            };

            setBlogFormData((prev) => ({
              ...prev,
              sections: [...prev.sections, newSection],
            }));

            setError(null); // Clear any previous errors
          } catch (error) {
            setError("Failed to add section to blog. Please try again.");
          }
        }
      }

      setShowSectionModal(false);
      setEditingSection(null);
      setEditingSectionIndex(-1);
      resetSectionForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section");
    } finally {
      setLoading(false);
    }
  };

  // Handle section form changes
  const handleSectionTitleChange = (
    language: "arabic" | "english",
    value: string
  ) => {
    setSectionFormData((prev) => ({
      ...prev,
      title: { ...prev.title, [language]: value },
    }));
  };

  const handleSectionContentChange = (
    language: "arabic" | "english",
    index: number,
    value: string
  ) => {
    setSectionFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [language]: prev.content[language].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const addContentParagraph = (language: "arabic" | "english") => {
    setSectionFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [language]: [...prev.content[language], ""],
      },
    }));
  };

  const removeContentParagraph = (
    language: "arabic" | "english",
    index: number
  ) => {
    if (sectionFormData.content[language].length > 1) {
      setSectionFormData((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          [language]: prev.content[language].filter((_, i) => i !== index),
        },
      }));
    }
  };

  // Blog Details View
  if (viewMode === "detail" && selectedBlog) {
    return (
      <div className="page-wrapper">
        <div className="content">
          {/* Header */}
          <div className="d-lg-flex align-items-center justify-content-between mb-4">
            <div>
              <button
                className="btn btn-outline-secondary mb-2"
                onClick={handleBackToList}
              >
                <FaArrowLeft className="me-1" /> Back to Blogs
              </button>
              <h2 className="mb-1">Blog Details</h2>
              <p>View and manage this blog post</p>
            </div>
            {/* <div>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditBlog(selectedBlog)}
              >
                <FaEdit className="me-1" /> Edit Blog
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteBlog(selectedBlog._id)}
                disabled={loading}
              >
                <FaTrash className="me-1" /> Delete Blog
              </button>
            </div> */}
          </div>

          {/* Blog Header */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <h3 className="card-title mb-3">
                    {selectedBlog.text.replace(/^"|"$/g, "")}
                  </h3>
                  <div className="text-muted">
                    <small>Blog ID: {selectedBlog._id}</small>
                  </div>
                </div>
                {/* <div className="col-md-4 text-center">
                  {selectedBlog.image && selectedBlog.image.secure_url ? (
                    <img
                      src={selectedBlog.image.secure_url}
                      alt="Blog"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "200px",
                        height: "150px",
                        backgroundColor: "#f8f9fa",
                        border: "1px dashed #dee2e6",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </div>

          {/* Blog Sections */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Blog Sections ({selectedBlog.sections.length})
              </h5>
            </div>
            <div className="card-body">
              {selectedBlog.sections.length > 0 ? (
                selectedBlog.sections.map((section, index) => (
                  <div key={section._id} className="border-bottom pb-4 mb-4">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="text-primary mb-3">
                          Section {index + 1} - English
                        </h6>
                        <h5 className="mb-3">{section.title.english}</h5>
                        <div className="mb-3">
                          {section.content.english.map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-2">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-success mb-3">
                          القسم {index + 1} - العربية
                        </h6>
                        <h5 className="mb-3" dir="rtl">
                          {section.title.arabic}
                        </h5>
                        <div className="mb-3" dir="rtl">
                          {section.content.arabic.map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-2">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-muted mt-3">
                      <small>Section ID: {section._id}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-4">
                  <p>No sections available for this blog.</p>
                </div>
              )}
            </div>
          </div>

          <CommonFooter />
        </div>
      </div>
    );
  }

  // Blog List View
  if (loading && blogs.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading blogs...</h5>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-lg-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="mb-1">Blog Management</h2>
            <p>Manage your website blog posts and content</p>
          </div>
          <ul className="table-top-head">
            <li>
              <button
                className="btn btn-success me-2"
                onClick={handleAddBlog}
                disabled={loading}
              >
                <FaPlus className="me-1" /> Add New Blog
              </button>
            </li>
            <CollapesIcon />
          </ul>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Actions</th>
                    <th>Title (Text)</th>
                    <th>Sections Count</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length > 0 ? (
                    blogs.map((blog) => (
                      <tr
                        key={blog._id}
                        onClick={() => handleEditBlog(blog)}
                        style={{ cursor: "pointer" }}
                        className="table-row-clickable"
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => handleViewBlog(blog)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditBlog(blog)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBlog(blog._id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                        <td>
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "300px", display: "block" }}
                          >
                            {blog.text}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {blog.sections.length}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        No blogs available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add/Edit Blog Modal */}
        {(showAddModal || showEditModal) && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingBlog ? "Edit Blog" : "Add New Blog"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingBlog(null);
                      resetBlogForm();
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* Blog Title */}
                  <div className="mb-3">
                    <label className="form-label">Blog Title (English)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={blogFormData.text}
                      onChange={(e) =>
                        setBlogFormData((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      placeholder="Enter blog title"
                    />
                    <p className="text-danger">
                      *Title must be match with the title of the blog in the
                      blogs route
                    </p>
                  </div>

                  {/* Image Upload */}
                  {/* <div className="mb-3">
                    <label className="form-label">Blog Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {selectedImage && (
                      <small className="text-muted">
                        Selected: {selectedImage.name}
                      </small>
                    )}
                    {editingBlog && !selectedImage && (
                      <small className="text-muted">
                        Current image will be kept if no new image is selected
                      </small>
                    )}
                  </div> */}

                  {/* Sections Management */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6>Blog Sections</h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={handleAddSection}
                      >
                        <FaPlus className="me-1" /> Add Section
                      </button>
                    </div>

                    {blogFormData.sections.length > 0 ? (
                      <div className="border rounded p-3">
                        {blogFormData.sections.map((section, index) => (
                          <div key={index} className="border-bottom pb-3 mb-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">Section {index + 1}</h6>
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => {
                                    // For editing, we need to get the original section from the database
                                    if (
                                      editingBlog &&
                                      editingBlog.sections[index]
                                    ) {
                                      const originalSection =
                                        editingBlog.sections[index];
                                      handleEditSection(
                                        editingBlog._id,
                                        originalSection,
                                        index
                                      );
                                    }
                                  }}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={async () => {
                                    try {
                                      // If we're editing an existing blog, delete from database
                                      if (
                                        editingBlog &&
                                        editingBlog.sections[index] &&
                                        "_id" in editingBlog.sections[index]
                                      ) {
                                        const sectionToDelete = editingBlog
                                          .sections[index] as BlogSection;
                                        await deleteSection(
                                          editingBlog._id,
                                          sectionToDelete._id
                                        );

                                        // Remove from local state
                                        setBlogFormData((prev) => ({
                                          ...prev,
                                          sections: prev.sections.filter(
                                            (_, i) => i !== index
                                          ),
                                        }));

                                        // Update editingBlog state
                                        setEditingBlog((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                sections: prev.sections.filter(
                                                  (_, i) => i !== index
                                                ),
                                              }
                                            : null
                                        );

                                        // Reload blogs to get updated data
                                        await loadBlogs();
                                      } else {
                                        // For new sections (no _id), just remove from local state
                                        setBlogFormData((prev) => ({
                                          ...prev,
                                          sections: prev.sections.filter(
                                            (_, i) => i !== index
                                          ),
                                        }));
                                      }
                                    } catch (error) {
                                      setError(
                                        "Failed to delete section. Please try again."
                                      );
                                    }
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <h6 className="text-primary">English</h6>
                                <p>
                                  <strong>Title:</strong>{" "}
                                  {section.title.english}
                                </p>
                                <p>
                                  <strong>Content:</strong>{" "}
                                  {section.content.english.length} paragraphs
                                </p>
                              </div>
                              <div className="col-md-6">
                                <h6 className="text-success">العربية</h6>
                                <p dir="rtl">
                                  <strong>العنوان:</strong>{" "}
                                  {section.title.arabic}
                                </p>
                                <p dir="rtl">
                                  <strong>المحتوى:</strong>{" "}
                                  {section.content.arabic.length} فقرات
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-4">
                        <p>
                          No sections added yet. Click &quot;Add Section&quot;
                          to get started.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingBlog(null);
                      resetBlogForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveBlog}
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingBlog
                      ? "Update Blog"
                      : "Add Blog"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Modal */}
        {showSectionModal && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingSection ? "Edit Section" : "Add New Section"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowSectionModal(false);
                      setEditingSection(null);
                      setEditingSectionIndex(-1);
                      resetSectionForm();
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* Section Title */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Title (English)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sectionFormData.title.english}
                        onChange={(e) =>
                          handleSectionTitleChange("english", e.target.value)
                        }
                        placeholder="Enter English title"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">العنوان (العربية)</label>
                      <input
                        type="text"
                        className="form-control"
                        dir="rtl"
                        value={sectionFormData.title.arabic}
                        onChange={(e) =>
                          handleSectionTitleChange("arabic", e.target.value)
                        }
                        placeholder="أدخل العنوان بالعربية"
                      />
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary mb-3">English Content</h6>
                      {sectionFormData.content.english.map(
                        (paragraph, index) => (
                          <div key={index} className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <label className="form-label mb-0 me-2">
                                Paragraph {index + 1}
                              </label>
                              {sectionFormData.content.english.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    removeContentParagraph("english", index)
                                  }
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                            <textarea
                              className="form-control"
                              rows={3}
                              value={paragraph}
                              onChange={(e) =>
                                handleSectionContentChange(
                                  "english",
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter paragraph ${index + 1}`}
                            />
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => addContentParagraph("english")}
                      >
                        <FaPlus className="me-1" /> Add Paragraph
                      </button>
                    </div>

                    <div className="col-md-6">
                      <h6 className="text-success mb-3">المحتوى العربي</h6>
                      {sectionFormData.content.arabic.map(
                        (paragraph, index) => (
                          <div key={index} className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <label className="form-label mb-0 me-2">
                                الفقرة {index + 1}
                              </label>
                              {sectionFormData.content.arabic.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    removeContentParagraph("arabic", index)
                                  }
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                            <textarea
                              className="form-control"
                              dir="rtl"
                              rows={3}
                              value={paragraph}
                              onChange={(e) =>
                                handleSectionContentChange(
                                  "arabic",
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder={`أدخل الفقرة ${index + 1}`}
                            />
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => addContentParagraph("arabic")}
                      >
                        <FaPlus className="me-1" /> إضافة فقرة
                      </button>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowSectionModal(false);
                      setEditingSection(null);
                      setEditingSectionIndex(-1);
                      resetSectionForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveSection}
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingSection
                      ? "Update Section"
                      : "Add Section"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <CommonFooter />
      </div>
    </div>
  );
};

export default BlogManagement;
