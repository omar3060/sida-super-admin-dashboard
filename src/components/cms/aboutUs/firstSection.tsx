"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit } from "react-icons/fa";
import { AboutUsFirstSection } from "@/types/aboutUsTypes/aboutUsFirstSection";
import { aboutUsFirstSectionService } from "@/services/aboutUsService/aboutUsFirstSectionService";

export default function FirstSectionManagement() {
  const [firstSection, setFirstSection] = useState<AboutUsFirstSection | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingFirstSection, setEditingFirstSection] =
    useState<AboutUsFirstSection | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadFirstSection();
  }, []);

  const loadFirstSection = async () => {
    try {
      setLoading(true);
      setError(null);

      const firstSectionData =
        await aboutUsFirstSectionService.getAboutUsFirstSection();
      setFirstSection(firstSectionData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load first section data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (firstSection) {
      setEditingFirstSection({ ...firstSection });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFirstSection(null);
    setSelectedFile(null);
  };

  const updateFirstSectionField = (
    field: string,
    value: string,
    language: "english" | "arabic"
  ) => {
    if (!editingFirstSection) return;

    setEditingFirstSection({
      ...editingFirstSection,
      [language]: {
        ...editingFirstSection[language],
        [field]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveFirstSection = async () => {
    if (!editingFirstSection) return;

    try {
      setLoading(true);
      setError(null);

      await aboutUsFirstSectionService.updateAboutUsFirstSection(
        editingFirstSection,
        selectedFile || undefined
      );

      const updatedFirstSection =
        await aboutUsFirstSectionService.getAboutUsFirstSection();

      setFirstSection(updatedFirstSection);

      setShowModal(false);
      setEditingFirstSection(null);
      setSelectedFile(null);
            
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save first section data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !firstSection) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading about us first section data...</h5>
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
                onClick={loadFirstSection}
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
            <h2 className="mb-1">About Us First Section Management</h2>
            <p>Manage your about us page first section content and image</p>
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

        {firstSection && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">About Us First Section Content</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong>{" "}
                    {firstSection.english?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Content:</strong>{" "}
                    {firstSection.english?.content || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong>{" "}
                    {firstSection.arabic?.title || "غير متوفر"}
                  </p>
                  <p>
                    <strong>المحتوى:</strong>{" "}
                    {firstSection.arabic?.content || "غير متوفر"}
                  </p>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <h6 className="text-info">Current Image</h6>
                  {firstSection.images && firstSection.images[0] ? (
                    <img
                      src={firstSection.images[0].secure_url}
                      alt="About Us First Section"
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

        {showModal && editingFirstSection && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit About Us First Section</h5>
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
                          value={editingFirstSection.english?.title || ""}
                          onChange={(e) =>
                            updateFirstSectionField(
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
                          value={editingFirstSection.english?.content || ""}
                          onChange={(e) =>
                            updateFirstSectionField(
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
                          value={editingFirstSection.arabic?.title || ""}
                          onChange={(e) =>
                            updateFirstSectionField(
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
                          value={editingFirstSection.arabic?.content || ""}
                          onChange={(e) =>
                            updateFirstSectionField(
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
                    onClick={handleSaveFirstSection}
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
