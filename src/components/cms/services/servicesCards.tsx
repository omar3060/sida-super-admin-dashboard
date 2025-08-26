"use client";

import React, { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import {
  ParsedServicesCardsSlider,
  ServicesCardsSlide,
  ServicesCardsLanguage,
} from "../../../types/servicesTypes/servicesCards";
import {
  getServicesCardsSlider,
  updateTitleContent,
  addSlide,
  updateSlide,
  deleteSlide,
} from "../../../services/servicesService/servicesCardsService";

const ServicesCardsManagement: React.FC = () => {
  const [servicesCardsData, setServicesCardsData] =
    useState<ParsedServicesCardsSlider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingServicesCards, setEditingServicesCards] =
    useState<ParsedServicesCardsSlider | null>(null);
  const [editingSlide, setEditingSlide] = useState<ServicesCardsSlide | null>(
    null
  );
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [slideFormData, setSlideFormData] = useState({
    titleArabic: "",
    titleEnglish: "",
    contentArabic: "",
    contentEnglish: "",
    text: "",
  });

  useEffect(() => {
    loadServicesCardsData();
  }, []);

  const loadServicesCardsData = async () => {
    try {
      setLoading(true);
      const data = await getServicesCardsSlider();
      setServicesCardsData(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load services cards data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (servicesCardsData) {
      setEditingServicesCards({ ...servicesCardsData });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingServicesCards(null);
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
      text: "",
    });
  };

  const handleSaveServicesCards = async () => {
    if (!editingServicesCards) return;

    try {
      setLoading(true);
      setError(null);

      await updateTitleContent(
        editingServicesCards._id,
        editingServicesCards.title,
        editingServicesCards.content
      );

      await loadServicesCardsData();
      setShowModal(false);
      setEditingServicesCards(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save services cards data"
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
      contentArabic: "",
      contentEnglish: "",
      text: "",
    });
    setShowSlideModal(true);
  };

  const handleEditSlideClick = (slide: ServicesCardsSlide) => {
    setEditingSlide(slide);
    setIsEditingSlide(true);
    setSlideFormData({
      titleArabic: slide.arabic.title,
      titleEnglish: slide.english.title,
      contentArabic: slide.arabic.content,
      contentEnglish: slide.english.content,
      text: slide.text || "",
    });
    setShowSlideModal(true);
  };

  const handleSaveSlide = async () => {
    if (!servicesCardsData) return;

    try {
      setLoading(true);
      setError(null);

      const arabicData: ServicesCardsLanguage = {
        title: slideFormData.titleArabic,
        content: slideFormData.contentArabic,
      };
      const englishData: ServicesCardsLanguage = {
        title: slideFormData.titleEnglish,
        content: slideFormData.contentEnglish,
      };

      if (isEditingSlide && editingSlide) {
        await updateSlide(
          editingSlide._id,
          selectedFile || undefined,
          slideFormData.titleArabic,
          slideFormData.titleEnglish,
          slideFormData.contentArabic,
          slideFormData.contentEnglish,
          slideFormData.text
        );
      } else {
        if (!selectedFile) {
          setError("Please select an image file");
          setLoading(false);
          return;
        }
        await addSlide(
          servicesCardsData._id,
          selectedFile,
          arabicData,
          englishData,
          slideFormData.text
        );
      }

      await loadServicesCardsData();
      setShowSlideModal(false);
      setEditingSlide(null);
      setIsEditingSlide(false);
      setSelectedFile(null);
      setSlideFormData({
        titleArabic: "",
        titleEnglish: "",
        contentArabic: "",
        contentEnglish: "",
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

      await deleteSlide(slideId);

      await loadServicesCardsData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slide");
    } finally {
      setLoading(false);
    }
  };

  const updateServicesCardsField = (
    field: string,
    value: string,
    language: "arabic" | "english"
  ) => {
    if (!editingServicesCards) return;

    if (field === "title" || field === "content") {
      setEditingServicesCards({
        ...editingServicesCards,
        [field]: {
          ...editingServicesCards[field as "title" | "content"],
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

  if (loading && !servicesCardsData) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading services cards data...</h5>
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
                onClick={loadServicesCardsData}
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
            <h2 className="mb-1">Services Cards Management</h2>
            <p>Manage your website services cards content and images</p>
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

        {servicesCardsData && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Content Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong>{" "}
                    {servicesCardsData.title.english || "No title set"}
                  </p>
                  <p>
                    <strong>Content:</strong>{" "}
                    {servicesCardsData.content.english || "No content set"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong>{" "}
                    {servicesCardsData.title.arabic || "لم يتم تعيين عنوان"}
                  </p>
                  <p>
                    <strong>المحتوى:</strong>{" "}
                    {servicesCardsData.content.arabic || "لم يتم تعيين محتوى"}
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
                    <th>Content (English)</th>
                    <th>Content (Arabic)</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesCardsData && servicesCardsData.slides.length > 0 ? (
                    servicesCardsData.slides.map((slide) => (
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
                              alt="Service Card"
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

      {showModal && editingServicesCards && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Edit Services Cards Title & Content
                </h5>
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
                        value={editingServicesCards.title?.english || ""}
                        onChange={(e) =>
                          updateServicesCardsField(
                            "title",
                            e.target.value,
                            "english"
                          )
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={editingServicesCards.content?.english || ""}
                        onChange={(e) =>
                          updateServicesCardsField(
                            "content",
                            e.target.value,
                            "english"
                          )
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
                        value={editingServicesCards.title?.arabic || ""}
                        onChange={(e) =>
                          updateServicesCardsField(
                            "title",
                            e.target.value,
                            "arabic"
                          )
                        }
                        dir="rtl"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">المحتوى</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={editingServicesCards.content?.arabic || ""}
                        onChange={(e) =>
                          updateServicesCardsField(
                            "content",
                            e.target.value,
                            "arabic"
                          )
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
                  onClick={handleSaveServicesCards}
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

                <div className="mb-3">
                  <label className="form-label">Text (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={slideFormData.text}
                    onChange={(e) =>
                      handleSlideFormChange("text", e.target.value)
                    }
                    placeholder="e.g., pos, inventory, cost, production"
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

export default ServicesCardsManagement;
