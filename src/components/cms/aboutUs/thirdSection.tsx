"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit } from "react-icons/fa";
import { AboutUsThirdSection } from "@/types/aboutUsTypes/aboutUsThirdSection";
import { aboutUsThirdSectionService } from "@/services/aboutUsService/aboutUsThirdSectionService";

export default function ThirdSectionManagement() {
  const [thirdSection, setThirdSection] = useState<AboutUsThirdSection | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingThirdSection, setEditingThirdSection] =
    useState<AboutUsThirdSection | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadThirdSection();
  }, []);

  const loadThirdSection = async () => {
    try {
      setLoading(true);
      setError(null);

      const thirdSectionData =
        await aboutUsThirdSectionService.getAboutUsThirdSection();
      setThirdSection(thirdSectionData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load third section data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (thirdSection) {
      setEditingThirdSection({ ...thirdSection });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingThirdSection(null);
    setSelectedFile(null);
  };

  const updateThirdSectionField = (
    field: string,
    value: string,
    language: "english" | "arabic"
  ) => {
    if (!editingThirdSection) return;

    setEditingThirdSection({
      ...editingThirdSection,
      [language]: {
        ...editingThirdSection[language],
        [field]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveThirdSection = async () => {
    if (!editingThirdSection) return;

    try {
      setLoading(true);
      setError(null);

      await aboutUsThirdSectionService.updateAboutUsThirdSection(
        editingThirdSection,
        selectedFile || undefined
      );

      const updatedThirdSection =
        await aboutUsThirdSectionService.getAboutUsThirdSection();

      setThirdSection(updatedThirdSection);

      setShowModal(false);
      setEditingThirdSection(null);
      setSelectedFile(null);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save third section data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !thirdSection) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading about us third section data...</h5>
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
                onClick={loadThirdSection}
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
            <h2 className="mb-1">About Us Third Section Management</h2>
            <p>Manage your about us page third section content and image</p>
          </div>
          <ul className="table-top-head">
            <li>
              <button
                className="btn btn-primary me-2"
                onClick={handleEditClick}
                disabled={loading}
              >
                <FaEdit className="me-1" /> Edit
              </button>
            </li>
            <CollapesIcon />
          </ul>
        </div>

        {thirdSection && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">About Us Third Section Content</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong>{" "}
                    {thirdSection.english?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Content:</strong>{" "}
                    {thirdSection.english?.content || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong>{" "}
                    {thirdSection.arabic?.title || "غير متوفر"}
                  </p>
                  <p>
                    <strong>المحتوى:</strong>{" "}
                    {thirdSection.arabic?.content || "غير متوفر"}
                  </p>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <h6 className="text-info">Current Image</h6>
                  {thirdSection.images && thirdSection.images[0] ? (
                    <img
                      src={thirdSection.images[0].secure_url}
                      alt="About Us Third Section"
                      style={{
                        maxWidth: "300px",
                        height: "auto",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    <p className="text-muted">No image available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && editingThirdSection && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit About Us Third Section</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary">English Content</h6>

                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingThirdSection.english?.title || ""}
                          onChange={(e) =>
                            updateThirdSectionField(
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
                          rows={5}
                          value={editingThirdSection.english?.content || ""}
                          onChange={(e) =>
                            updateThirdSectionField(
                              "content",
                              e.target.value,
                              "english"
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h6 className="text-success">Arabic Content</h6>

                      <div className="mb-3">
                        <label className="form-label">العنوان</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingThirdSection.arabic?.title || ""}
                          onChange={(e) =>
                            updateThirdSectionField(
                              "title",
                              e.target.value,
                              "arabic"
                            )
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">المحتوى</label>
                        <textarea
                          className="form-control"
                          rows={5}
                          value={editingThirdSection.arabic?.content || ""}
                          onChange={(e) =>
                            updateThirdSectionField(
                              "content",
                              e.target.value,
                              "arabic"
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <h6 className="text-info">Update Image (optional)</h6>
                      <div className="mb-3">
                        <label className="form-label">Select New Image</label>
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
                    onClick={handleSaveThirdSection}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && <div className="modal-backdrop show"></div>}
      </div>
      <CommonFooter />
    </div>
  );
}
