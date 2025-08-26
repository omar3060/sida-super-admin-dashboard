"use client";

import React, { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import {
  ParsedBlogsSlider,
  BlogsSlide,
  BlogsLanguage,
} from "@/types/blogTypes/blogs";
import {
  getBlogsSlider,
  updateTitleContent,
  addSlide,
  updateSlide,
  deleteSlide,
} from "@/services/blogService/blogsService";

const BlogsManagement: React.FC = () => {
  const [blogsData, setBlogsData] = useState<ParsedBlogsSlider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingBlogs, setEditingBlogs] = useState<ParsedBlogsSlider | null>(
    null
  );
  const [editingSlide, setEditingSlide] = useState<BlogsSlide | null>(null);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form states for slide content
  const [slideFormData, setSlideFormData] = useState({
    titleArabic: "",
    titleEnglish: "",
  });

  useEffect(() => {
    loadBlogsData();
  }, []);

  const loadBlogsData = async () => {
    try {
      setLoading(true);
      const data = await getBlogsSlider();
      setBlogsData(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load blogs data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (blogsData) {
      setEditingBlogs({ ...blogsData });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlogs(null);
  };

  const handleCloseSlideModal = () => {
    setShowSlideModal(false);
    setEditingSlide(null);
    setIsEditingSlide(false);
    setSelectedFile(null);
    setSlideFormData({
      titleArabic: "",
      titleEnglish: "",
    });
  };

  const handleSaveBlogs = async () => {
    if (!editingBlogs) return;

    try {
      setLoading(true);
      setError(null);

      await updateTitleContent(
        editingBlogs._id,
        editingBlogs.title,
        editingBlogs.content
      );

      await loadBlogsData();
      setShowModal(false);
      setEditingBlogs(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save blogs data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlideClick = () => {
    setEditingSlide(null);
    setIsEditingSlide(false);
    setSlideFormData({
      titleArabic: "",
      titleEnglish: "",
    });
    setShowSlideModal(true);
  };

  const handleEditSlideClick = (slide: BlogsSlide) => {
    setEditingSlide(slide);
    setIsEditingSlide(true);
    setSlideFormData({
      titleArabic: slide.arabic.title,
      titleEnglish: slide.english.title,
    });
    setShowSlideModal(true);
  };

  const handleSaveSlide = async () => {
    if (!blogsData) return;

    try {
      setLoading(true);
      setError(null);

      const arabicData: BlogsLanguage = {
        title: slideFormData.titleArabic,
        description: "",
      };
      const englishData: BlogsLanguage = {
        title: slideFormData.titleEnglish,
        description: "",
      };

      if (isEditingSlide && editingSlide) {
        await updateSlide(
          blogsData._id,
          editingSlide._id,
          selectedFile || new File([], ""),
          arabicData,
          englishData
        );
      } else {
        if (!selectedFile) {
          setError("Please select an image file");
          setLoading(false);
          return;
        }
        await addSlide(blogsData._id, selectedFile, arabicData, englishData);
      }

      await loadBlogsData();
      setShowSlideModal(false);
      setEditingSlide(null);
      setIsEditingSlide(false);
      setSelectedFile(null);
      setSlideFormData({
        titleArabic: "",
        titleEnglish: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save slide");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this slide?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError(null);

      await deleteSlide(blogsData?._id || "", slideId);

      await loadBlogsData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slide");
    } finally {
      setLoading(false);
    }
  };

  const updateBlogsField = (
    field: string,
    value: string,
    language: "arabic" | "english"
  ) => {
    if (!editingBlogs) return;

    if (field === "title" || field === "content") {
      setEditingBlogs({
        ...editingBlogs,
        [field]: {
          ...editingBlogs[
            field as keyof Pick<ParsedBlogsSlider, "title" | "content">
          ],
          [language]: value,
        },
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSlideFormChange = (field: string, value: string) => {
    setSlideFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading && !blogsData) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading blogs data...</h5>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="text-danger">Error: {error}</h5>
              <button className="btn btn-primary mt-2" onClick={loadBlogsData}>
                Try Again
              </button>
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
            <h2 className="mb-1">Blogs Slider Management</h2>
            <p>Manage your website blogs slider content and images</p>
          </div>
          <ul className="table-top-head">
            <li>
              <button
                className="btn btn-primary me-2"
                onClick={handleEditClick}
                disabled={loading}
              >
                <FaEdit className="me-1" /> Edit Content
              </button>
            </li>
            <li>
              <button
                className="btn btn-success"
                onClick={handleAddSlideClick}
                disabled={loading}
              >
                <FaPlus className="me-1" /> Add Slide
              </button>
            </li>
            <CollapesIcon />
          </ul>
        </div>

        {blogsData && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Content Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong> {blogsData.title.english}
                  </p>
                  <p>
                    <strong>Content:</strong> {blogsData.content.english}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong> {blogsData.title.arabic}
                  </p>
                  <p>
                    <strong>المحتوى:</strong> {blogsData.content.arabic}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Actions</th>
                    <th>Image</th>
                    <th>Title (English)</th>
                    <th>Title (Arabic)</th>
                  </tr>
                </thead>
                <tbody>
                  {blogsData && blogsData.slides.length > 0 ? (
                    blogsData.slides.map((slide) => (
                      <tr
                        key={slide._id}
                        onClick={() => handleEditSlideClick(slide)}
                        style={{ cursor: "pointer" }}
                        className="table-row-clickable"
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditSlideClick(slide)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteSlide(slide._id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                        <td>
                          {slide.image && slide.image.secure_url ? (
                            <img
                              src={slide.image.secure_url}
                              alt="Blog"
                              style={{
                                width: "60px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                              className="rounded"
                            />
                          ) : (
                            <div
                              style={{
                                width: "60px",
                                height: "40px",
                                backgroundColor: "#f8f9fa",
                                border: "1px dashed #dee2e6",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                              }}
                            >
                              No Image
                            </div>
                          )}
                        </td>
                        <td>{slide.english.title}</td>
                        <td dir="rtl">{slide.arabic.title}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No slides available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && editingBlogs && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Blogs Content</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>

              <div className="modal-body">
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#english-content"
                    >
                      English
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#arabic-content"
                    >
                      Arabic
                    </a>
                  </li>
                </ul>

                <div className="tab-content">
                  <div className="tab-pane active" id="english-content">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingBlogs.title?.english || ""}
                        onChange={(e) =>
                          updateBlogsField("title", e.target.value, "english")
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={editingBlogs.content?.english || ""}
                        onChange={(e) =>
                          updateBlogsField("content", e.target.value, "english")
                        }
                      />
                    </div>
                  </div>

                  <div className="tab-pane" id="arabic-content">
                    <div className="mb-3">
                      <label className="form-label">العنوان</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingBlogs.title?.arabic || ""}
                        onChange={(e) =>
                          updateBlogsField("title", e.target.value, "arabic")
                        }
                        dir="rtl"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">المحتوى</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={editingBlogs.content?.arabic || ""}
                        onChange={(e) =>
                          updateBlogsField("content", e.target.value, "arabic")
                        }
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveBlogs}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSlideModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditingSlide ? "Edit Slide" : "Add New Slide"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseSlideModal}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    <FaImage className="me-2" />
                    Select Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <small className="text-muted">
                      Selected: {selectedFile.name}
                    </small>
                  )}
                </div>

                {/* Content Forms */}
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">English Content</h6>
                    <div className="mb-3">
                      <label className="form-label">Title (English)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={slideFormData.titleEnglish}
                        onChange={(e) =>
                          handleSlideFormChange("titleEnglish", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-success mb-3">المحتوى العربي</h6>
                    <div className="mb-3">
                      <label className="form-label">العنوان (العربية)</label>
                      <input
                        type="text"
                        className="form-control"
                        dir="rtl"
                        value={slideFormData.titleArabic}
                        onChange={(e) =>
                          handleSlideFormChange("titleArabic", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {isEditingSlide &&
                  editingSlide &&
                  editingSlide.image &&
                  editingSlide.image.secure_url && (
                    <div className="mb-3">
                      <label className="form-label">Current Image</label>
                      <div className="text-center">
                        <img
                          src={editingSlide.image.secure_url}
                          alt="Current slide"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    </div>
                  )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseSlideModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveSlide}
                >
                  {loading
                    ? "Saving..."
                    : isEditingSlide
                    ? "Update Slide"
                    : "Add Slide"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CommonFooter />
    </div>
  );
};

export default BlogsManagement;
