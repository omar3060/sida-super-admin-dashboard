"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit } from "react-icons/fa";
import { AboutUsCidaCircle } from "@/types/aboutUsTypes/aboutUsCidaCircle";
import { aboutUsCidaCircleService } from "@/services/aboutUsService/aboutUsCidaCircleService";

export default function CidaCircleManagement() {
  const [cidaCircle, setCidaCircle] = useState<AboutUsCidaCircle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCidaCircle, setEditingCidaCircle] =
    useState<AboutUsCidaCircle | null>(null);

  useEffect(() => {
    loadCidaCircle();
  }, []);

  const loadCidaCircle = async () => {
    try {
      setLoading(true);
      setError(null);

      const cidaCircleData =
        await aboutUsCidaCircleService.getAboutUsCidaCircle();
      setCidaCircle(cidaCircleData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load cida circle data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (cidaCircle) {
      setEditingCidaCircle({ ...cidaCircle });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCidaCircle(null);
  };

  const updateCidaCircleField = (
    field: string,
    value: string,
    language: "english" | "arabic"
  ) => {
    if (!editingCidaCircle) return;

    setEditingCidaCircle({
      ...editingCidaCircle,
      [language]: {
        ...editingCidaCircle[language],
        [field]: value,
      },
    });
  };

  const handleSaveCidaCircle = async () => {
    if (!editingCidaCircle) return;

    try {
      setLoading(true);
      setError(null);

      await aboutUsCidaCircleService.updateAboutUsCidaCircle(editingCidaCircle);

      const updatedCidaCircle =
        await aboutUsCidaCircleService.getAboutUsCidaCircle();

      setCidaCircle(updatedCidaCircle);

      setShowModal(false);
      setEditingCidaCircle(null);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save cida circle data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cidaCircle) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading about us cida circle data...</h5>
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
              <button className="btn btn-primary mt-2" onClick={loadCidaCircle}>
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
            <h2 className="mb-1">About Us Cida Circle Management</h2>
            <p>Manage your about us page cida circle content</p>
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

        {cidaCircle && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">About Us Cida Circle Content</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong> {cidaCircle.english?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Content:</strong>{" "}
                    {cidaCircle.english?.content || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong>{" "}
                    {cidaCircle.arabic?.title || "غير متوفر"}
                  </p>
                  <p>
                    <strong>المحتوى:</strong>{" "}
                    {cidaCircle.arabic?.content || "غير متوفر"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && editingCidaCircle && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit About Us Cida Circle</h5>
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
                          value={editingCidaCircle.english?.title || ""}
                          onChange={(e) =>
                            updateCidaCircleField(
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
                          value={editingCidaCircle.english?.content || ""}
                          onChange={(e) =>
                            updateCidaCircleField(
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
                          value={editingCidaCircle.arabic?.title || ""}
                          onChange={(e) =>
                            updateCidaCircleField(
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
                          value={editingCidaCircle.arabic?.content || ""}
                          onChange={(e) =>
                            updateCidaCircleField(
                              "content",
                              e.target.value,
                              "arabic"
                            )
                          }
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
                    onClick={handleSaveCidaCircle}
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
