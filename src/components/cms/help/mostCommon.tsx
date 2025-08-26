"use client";

import React, { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit, FaTrash, FaPlus, FaImage, FaFilter } from "react-icons/fa";
import { mostCommonService } from "@/services/helpService/mostCommonService";
import { MostCommonData, MostCommonSlide } from "@/types/helpTypes/mostCommon";

const MostCommonManagement: React.FC = () => {
  const [data, setData] = useState<MostCommonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<MostCommonSlide | null>(
    null
  );
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [slideFormData, setSlideFormData] = useState({
    titleArabic: "",
    titleEnglish: "",
    text: "",
  });

  // Filter states
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [filteredSlides, setFilteredSlides] = useState<MostCommonSlide[]>([]);

  useEffect(() => {
    loadMostCommonData();
  }, []);

  const loadMostCommonData = async () => {
    try {
      setLoading(true);
      const response = await mostCommonService.getMostCommon();
      setData(response);
      setFilteredSlides(response.slider.slides);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load most common data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get unique text values for filter
  const getUniqueTexts = () => {
    if (!data) return [];
    return [...new Set(data.slider.slides.map((slide) => slide.text))];
  };

  // Handle filter change
  const handleFilterChange = (text: string) => {
    setSelectedFilter(text);
    if (text === "all") {
      setFilteredSlides(data?.slider.slides || []);
    } else {
      const filtered =
        data?.slider.slides.filter((slide) => slide.text === text) || [];
      setFilteredSlides(filtered);
    }
  };

  const handleCloseSlideModal = () => {
    setShowSlideModal(false);
    setEditingSlide(null);
    setIsEditingSlide(false);
    setSelectedFile(null);
    setSlideFormData({
      titleArabic: "",
      titleEnglish: "",
      text: "",
    });
  };

  const handleAddSlideClick = () => {
    setEditingSlide(null);
    setIsEditingSlide(false);
    setSlideFormData({
      titleArabic: "",
      titleEnglish: "",
      text: "",
    });
    setShowSlideModal(true);
  };

  const handleEditSlideClick = (slide: MostCommonSlide) => {
    setEditingSlide(slide);
    setIsEditingSlide(true);
    setSlideFormData({
      titleArabic: slide.arabic.title,
      titleEnglish: slide.english.title,
      text: slide.text,
    });
    setShowSlideModal(true);
  };

  const handleSaveSlide = async () => {
    if (!data) return;

    try {
      setLoading(true);
      setError(null);

      if (isEditingSlide && editingSlide && editingSlide._id) {
        await mostCommonService.updateSlide(
          editingSlide._id,
          selectedFile || undefined,
          slideFormData.titleArabic,
          slideFormData.titleEnglish,
          slideFormData.text
        );
      } else {
        if (!selectedFile) {
          setError("Please select an image file");
          setLoading(false);
          return;
        }
        await mostCommonService.addSlide(
          data.slider._id,
          selectedFile,
          {
            title: slideFormData.titleArabic,
          },
          {
            title: slideFormData.titleEnglish,
          },
          slideFormData.text
        );
      }

      await loadMostCommonData();
      setSelectedFilter("all");
      setShowSlideModal(false);
      setEditingSlide(null);
      setIsEditingSlide(false);
      setSelectedFile(null);
      setSlideFormData({
        titleArabic: "",
        titleEnglish: "",
        text: "",
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

      await mostCommonService.deleteSlide(slideId);

      await loadMostCommonData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slide");
    } finally {
      setLoading(false);
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

  if (loading && !data) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading most common data...</h5>
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
              <button
                className="btn btn-primary mt-2"
                onClick={loadMostCommonData}
              >
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
            <h2 className="mb-1">Most Common Help Management</h2>
            <p>Manage your website most common help content and images</p>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="d-flex align-items-center me-3">
                <FaFilter className="me-2 text-muted" />
                <select
                  className="form-select form-select-sm"
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  style={{ minWidth: "150px" }}
                >
                  <option value="all">All Texts</option>
                  {getUniqueTexts().map((text) => (
                    <option key={text} value={text}>
                      {text}
                    </option>
                  ))}
                </select>
              </div>
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

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Actions</th>
                    <th>Article Name (English)</th>
                    <th>Article Name (Arabic)</th>
                    <th>Image</th>
                    <th>Title (English)</th>
                    <th>Title (Arabic)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSlides.length > 0 ? (
                    filteredSlides.map((slide) => (
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
                          <span className="badge bg-primary">{slide.text}</span>
                        </td>
                        <td>
                          <span className="badge bg-success" dir="rtl">
                            {slide.text}
                          </span>
                        </td>
                        <td>
                          {slide.image && slide.image.secure_url ? (
                            <img
                              src={slide.image.secure_url}
                              alt="Most Common Help Slide"
                              style={{
                                width: "60px",
                                height: "55px",
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
                      <td colSpan={6} className="text-center">
                        {selectedFilter === "all"
                          ? "No slides available"
                          : `No slides found for "${selectedFilter}"`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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

                <div className="mb-3">
                  <label className="form-label">Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={slideFormData.text}
                    onChange={(e) =>
                      handleSlideFormChange("text", e.target.value)
                    }
                    placeholder="Enter text"
                  />
                </div>

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
                      <p className="text-danger">
                        *Title must be match with the title of the article
                      </p>
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
                      <p className="text-danger">
                        *العنوان يجب أن يتطابق مع العنوان للمقالة
                      </p>
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

export default MostCommonManagement;
