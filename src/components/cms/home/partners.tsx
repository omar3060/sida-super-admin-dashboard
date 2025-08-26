"use client";

import React, { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import {
  ParsedPartnersSlider,
  PartnerSlide,
  PartnersLanguage,
} from "@/types/homeTypes/partners";
import {
  getPartnersSlider,
  updateTitleContent,
  addSlide,
  updateSlide,
  deleteSlide,
} from "@/services/HomeService/partnersService";

const PartnersManagement: React.FC = () => {
  const [partnersData, setPartnersData] = useState<ParsedPartnersSlider | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingPartners, setEditingPartners] =
    useState<ParsedPartnersSlider | null>(null);
  const [editingSlide, setEditingSlide] = useState<PartnerSlide | null>(null);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadPartnersData();
  }, []);

  const loadPartnersData = async () => {
    try {
      setLoading(true);
      const data = await getPartnersSlider();
      setPartnersData(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load partners data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPartners(null);
  };

  const handleCloseSlideModal = () => {
    setShowSlideModal(false);
    setEditingSlide(null);
    setIsEditingSlide(false);
    setSelectedFile(null);
  };

  const handleSavePartners = async () => {
    if (!editingPartners) return;

    try {
      setLoading(true);
      setError(null);

      await updateTitleContent(
        editingPartners._id,
        editingPartners.title,
        editingPartners.content
      );

      await loadPartnersData();
      setShowModal(false);
      setEditingPartners(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save partners data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlideClick = () => {
    setEditingSlide(null);
    setIsEditingSlide(false);
    setShowSlideModal(true);
  };

  const handleEditSlideClick = (slide: PartnerSlide) => {
    setEditingSlide(slide);
    setIsEditingSlide(true);
    setShowSlideModal(true);
  };

  const handleSaveSlide = async () => {
    if (!selectedFile || !partnersData) {
      setError("Please select an image file");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditingSlide && editingSlide) {
        await updateSlide(
          editingSlide._id,
          selectedFile,
          "", // titleArabic - default empty
          "", // titleEnglish - default empty
          "", // contentArabic - default empty
          "", // contentEnglish - default empty
          "" // text - default empty
        );
      } else {
        const emptyLang: PartnersLanguage = { arabic: "", english: "" };
        await addSlide(partnersData._id, selectedFile, emptyLang, emptyLang);
      }

      await loadPartnersData();
      setShowSlideModal(false);
      setEditingSlide(null);
      setIsEditingSlide(false);
      setSelectedFile(null);
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

      await loadPartnersData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slide");
    } finally {
      setLoading(false);
    }
  };

  const updatePartnersField = (
    field: string,
    value: string,
    language: "arabic" | "english"
  ) => {
    if (!editingPartners) return;

    setEditingPartners({
      ...editingPartners,
      [field]: {
        ...(editingPartners[
          field as keyof ParsedPartnersSlider
        ] as PartnersLanguage),
        [language]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (loading && !partnersData) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading partners data...</h5>
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
                onClick={loadPartnersData}
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
            <h2 className="mb-1">Partners Management</h2>
            <p>Manage your website partners content and images</p>
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

        {partnersData && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Content Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong> {partnersData.title.english}
                  </p>
                  <p>
                    <strong>Content:</strong> {partnersData.content.english}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong> {partnersData.title.arabic}
                  </p>
                  <p>
                    <strong>المحتوى:</strong> {partnersData.content.arabic}
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
                  </tr>
                </thead>
                <tbody>
                  {partnersData && partnersData.slides.length > 0 ? (
                    partnersData.slides.map((slide) => (
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
                              alt="Partner"
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center">
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

      {showModal && editingPartners && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Partners Content</h5>
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
                        value={editingPartners.title?.english || ""}
                        onChange={(e) =>
                          updatePartnersField(
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
                        value={editingPartners.content?.english || ""}
                        onChange={(e) =>
                          updatePartnersField(
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
                        value={editingPartners.title?.arabic || ""}
                        onChange={(e) =>
                          updatePartnersField("title", e.target.value, "arabic")
                        }
                        dir="rtl"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">المحتوى</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={editingPartners.content?.arabic || ""}
                        onChange={(e) =>
                          updatePartnersField(
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
                  onClick={handleSavePartners}
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
          <div className="modal-dialog modal-dialog-centered">
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
                  disabled={loading || !selectedFile}
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

export default PartnersManagement;
