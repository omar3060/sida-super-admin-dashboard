"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit } from "react-icons/fa";
import { ServicesHero } from "@/types/servicesTypes/servicesHero";
import { servicesHeroService } from "@/services/servicesService/servicesHeroService";

export default function ServicesHeroManagement() {

  const [servicesHero, setServicesHero] = useState<ServicesHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingServicesHero, setEditingServicesHero] =
    useState<ServicesHero | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadServicesHero();
  }, []);

  const loadServicesHero = async () => {
    try {
          setLoading(true);
      setError(null);

      const servicesHeroData = await servicesHeroService.getServicesHero();
      setServicesHero(servicesHeroData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load services hero data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (servicesHero) {
      setEditingServicesHero({ ...servicesHero });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingServicesHero(null);
    setSelectedFile(null);
  };

  const updateServicesHeroField = (
    field: string,
    value: string,
    language: "english" | "arabic"
  ) => {
    if (!editingServicesHero) return;

    setEditingServicesHero({
      ...editingServicesHero,
      [language]: {
        ...editingServicesHero[language],
        [field]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };


  const handleSaveServicesHero = async () => {
    if (!editingServicesHero) return;

    try {
      setLoading(true);
      setError(null);

      await servicesHeroService.updateServicesHero(
        editingServicesHero,
        selectedFile || undefined
      );

      const updatedServicesHero = await servicesHeroService.getServicesHero();

      setServicesHero(updatedServicesHero);

      setShowModal(false);
      setEditingServicesHero(null);
      setSelectedFile(null);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save services hero data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !servicesHero) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading services hero data...</h5>
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
                onClick={loadServicesHero}
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
            <h2 className="mb-1">Services Hero Section Management</h2>
            <p>Manage your services page hero section content and image</p>
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


        {servicesHero && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Services Hero Content</h5>
            </div>
            <div className="card-body">
              
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong>{" "}
                    {servicesHero.english?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Content:</strong>{" "}
                    {servicesHero.english?.content || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong>{" "}
                    {servicesHero.arabic?.title || "غير متوفر"}
                  </p>
                  <p>
                    <strong>المحتوى:</strong>{" "}
                    {servicesHero.arabic?.content || "غير متوفر"}
                  </p>
                </div>
              </div>

              
              <div className="row mt-3">
                <div className="col-12">
                  <h6 className="text-info">Current Image</h6>
                  {servicesHero.images && servicesHero.images[0] ? (
                    <img
                      src={servicesHero.images[0].secure_url}
                      alt="Services Hero"
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

        
        {showModal && editingServicesHero && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                
                <div className="modal-header">
                  <h5 className="modal-title">Edit Services Hero Section</h5>
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
                        <textarea
                          className="form-control"
                          rows={3}
                          value={editingServicesHero.english?.title || ""}
                          onChange={(e) =>
                            updateServicesHeroField(
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
                          value={editingServicesHero.english?.content || ""}
                          onChange={(e) =>
                            updateServicesHeroField(
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
                        <textarea
                          className="form-control"
                          rows={3}
                          value={editingServicesHero.arabic?.title || ""}
                          onChange={(e) =>
                            updateServicesHeroField(
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
                          rows={4}
                          value={editingServicesHero.arabic?.content || ""}
                          onChange={(e) =>
                            updateServicesHeroField(
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
                    onClick={handleSaveServicesHero}
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
