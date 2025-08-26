"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit } from "react-icons/fa";
import { Features } from "@/types/homeTypes/features";
import { featuresService } from "@/services/servicesService/featuresService";

export default function FeaturesManagement() {
  const [features, setFeatures] = useState<Features | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingFeatures, setEditingFeatures] = useState<Features | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      setError(null);

      const featuresData = await featuresService.getFeatures();
      setFeatures(featuresData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load features data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (features) {
      setEditingFeatures({ ...features });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFeatures(null);
    setSelectedFile(null);
  };

  const updateFeaturesField = (
    field: string,
    value: string,
    language: "english" | "arabic"
  ) => {
    if (!editingFeatures) return;

    setEditingFeatures({
      ...editingFeatures,
      [language]: {
        ...editingFeatures[language],
        [field]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveFeatures = async () => {
    if (!editingFeatures) return;

    try {
      setLoading(true);
      setError(null);

      await featuresService.updateFeatures(
        editingFeatures,
        selectedFile || undefined
      );

      const updatedFeatures = await featuresService.getFeatures();

      setFeatures(updatedFeatures);

      setShowModal(false);
      setEditingFeatures(null);
      setSelectedFile(null);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save features data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !features) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading features data...</h5>
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
              <button className="btn btn-primary mt-2" onClick={loadFeatures}>
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
            <h2 className="mb-1">Features Management</h2>
            <p>Manage your features content and image</p>
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

        {features && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Features Content</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong> {features.english?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Content:</strong>{" "}
                    {features.english?.content || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong>{" "}
                    {features.arabic?.title || "غير متوفر"}
                  </p>
                  <p>
                    <strong>المحتوى:</strong>{" "}
                    {features.arabic?.content || "غير متوفر"}
                  </p>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <h6 className="text-info">Current Image</h6>
                  {features.images && features.images[0] ? (
                    <img
                      src={features.images[0].secure_url}
                      alt="Features"
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

        {showModal && editingFeatures && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Features</h5>
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
                          value={editingFeatures.english?.title || ""}
                          onChange={(e) =>
                            updateFeaturesField(
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
                          value={editingFeatures.english?.content || ""}
                          onChange={(e) =>
                            updateFeaturesField(
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
                          value={editingFeatures.arabic?.title || ""}
                          onChange={(e) =>
                            updateFeaturesField(
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
                          value={editingFeatures.arabic?.content || ""}
                          onChange={(e) =>
                            updateFeaturesField(
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
                    onClick={handleSaveFeatures}
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
