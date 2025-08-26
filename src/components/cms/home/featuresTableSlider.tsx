"use client";

import React, { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import {
  FeatureTableSlider,
  FeatureTableSlide,
  FeatureTableSlideContent,
} from "@/types/homeTypes/featuresTableSlider";
import { featuresTableSliderService } from "@/services/HomeService/featuresTableSliderService";

const FeaturesTableSlider: React.FC = () => {
  const [featuresTableData, setFeaturesTableData] =
    useState<FeatureTableSlider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<FeatureTableSlide | null>(
    null
  );
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [slideFormData, setSlideFormData] = useState({
    titleArabic: "",
    titleEnglish: "",
    contentArabic: "",
    contentEnglish: "",
  });

  useEffect(() => {
    loadFeaturesTableData();
  }, []);

  const loadFeaturesTableData = async () => {
    try {
      setLoading(true);
      const response = await featuresTableSliderService.getSlider();
      setFeaturesTableData(response.slider);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load features table data"
      );
    } finally {
      setLoading(false);
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
      contentArabic: "",
      contentEnglish: "",
    });
  };

  const handleAddSlideClick = () => {
    setEditingSlide(null);
    setIsEditingSlide(false);
    setSlideFormData({
      titleArabic: "",
      titleEnglish: "",
      contentArabic: "",
      contentEnglish: "",
    });
    setShowSlideModal(true);
  };

  const handleEditSlideClick = (slide: FeatureTableSlide) => {
    setEditingSlide(slide);
    setIsEditingSlide(true);
    setSlideFormData({
      titleArabic: slide.arabic.title,
      titleEnglish: slide.english.title,
      contentArabic: slide.arabic.content,
      contentEnglish: slide.english.content,
    });
    setShowSlideModal(true);
  };

  const handleSaveSlide = async () => {
    if (!featuresTableData) return;

    try {
      setLoading(true);
      setError(null);

      const arabicData: FeatureTableSlideContent = {
        title: slideFormData.titleArabic,
        content: slideFormData.contentArabic,
      };
      const englishData: FeatureTableSlideContent = {
        title: slideFormData.titleEnglish,
        content: slideFormData.contentEnglish,
      };

      if (isEditingSlide && editingSlide) {
        await featuresTableSliderService.updateSlide(editingSlide._id, {
          arabic: JSON.stringify(arabicData),
          english: JSON.stringify(englishData),
          image: selectedFile || undefined,
        });
      } else {
        if (!selectedFile) {
          setError("Please select an image file");
          setLoading(false);
          return;
        }
        await featuresTableSliderService.addSlide(featuresTableData._id, {
          arabic: JSON.stringify(arabicData),
          english: JSON.stringify(englishData),
          image: selectedFile,
        });
      }

      await loadFeaturesTableData();
      setShowSlideModal(false);
      setEditingSlide(null);
      setIsEditingSlide(false);
      setSelectedFile(null);
      setSlideFormData({
        titleArabic: "",
        titleEnglish: "",
        contentArabic: "",
        contentEnglish: "",
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

      await featuresTableSliderService.deleteSlide(slideId);

      await loadFeaturesTableData();
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

  if (loading && !featuresTableData) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading features table data...</h5>
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
                onClick={loadFeaturesTableData}
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
            <h2 className="mb-1">Features Table Slider Management</h2>
            <p>Manage your website features table slider content and images</p>
          </div>
          <ul className="table-top-head">
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
                    <th>Image</th>
                    <th>Title (English)</th>
                    <th>Title (Arabic)</th>
                    <th>Content (English)</th>
                    <th>Content (Arabic)</th>
                  </tr>
                </thead>
                <tbody>
                  {featuresTableData && featuresTableData.slides.length > 0 ? (
                    featuresTableData.slides.map((slide) => (
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
                              alt="Features Table"
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
                        <td>
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "200px", display: "block" }}
                          >
                            {slide.english.content}
                          </span>
                        </td>
                        <td dir="rtl">
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "200px", display: "block" }}
                          >
                            {slide.arabic.content}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
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
                    <div className="mb-3">
                      <label className="form-label">Content (English)</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={slideFormData.contentEnglish}
                        onChange={(e) =>
                          handleSlideFormChange(
                            "contentEnglish",
                            e.target.value
                          )
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
                    <div className="mb-3">
                      <label className="form-label">المحتوى (العربية)</label>
                      <textarea
                        className="form-control"
                        dir="rtl"
                        rows={4}
                        value={slideFormData.contentArabic}
                        onChange={(e) =>
                          handleSlideFormChange("contentArabic", e.target.value)
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

export default FeaturesTableSlider;
