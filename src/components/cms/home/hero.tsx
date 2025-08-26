"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit } from "react-icons/fa";
import { Hero } from "@/types/homeTypes/hero";
import { heroService } from "@/services/HomeService/heroHome";

export default function HeroManagement() {

  const [hero, setHero] = useState<Hero | null>(null); // بيانات الـ Hero الحالية
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState<string | null>(null); // رسائل الخطأ

  const [showModal, setShowModal] = useState(false); // هل المودال مفتوح؟
  const [editingHero, setEditingHero] = useState<Hero | null>(null); // البيانات اللي بنعدل عليها
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // الصورة المختارة


  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      setLoading(true);
      setError(null);

      const heroData = await heroService.getHero();
      setHero(heroData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hero data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (hero) {
      setEditingHero({ ...hero });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHero(null);
    setSelectedFile(null);
  };

  const updateHeroField = (
    field: string,
    value: string,
    language: "english" | "arabic"
  ) => {
    if (!editingHero) return;

    setEditingHero({
      ...editingHero,
      [language]: {
        ...editingHero[language],
        [field]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveHero = async () => {
    if (!editingHero) return;

    try {
      setLoading(true);
      setError(null);

      await heroService.updateHero(editingHero, selectedFile || undefined);

      const updatedHero = await heroService.getHero();

      setHero(updatedHero);

      setShowModal(false);
      setEditingHero(null);
      setSelectedFile(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save hero data");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !hero) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading hero data...</h5>
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
              <button className="btn btn-primary mt-2" onClick={loadHero}>
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
            <h2 className="mb-1">Hero Section Management</h2>
            <p>Manage your website hero section content and image</p>
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

        {hero && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Hero Content</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong> {hero.english?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Content:</strong> {hero.english?.content || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong>{" "}
                    {hero.arabic?.title || "غير متوفر"}
                  </p>
                  <p>
                    <strong>المحتوى:</strong>{" "}
                    {hero.arabic?.content || "غير متوفر"}
                  </p>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <h6 className="text-info">Current Image</h6>
                  {hero.images && hero.images[0] ? (
                    <img
                      src={hero.images[0].secure_url}
                      alt="Hero"
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


        {showModal && editingHero && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                
                <div className="modal-header">
                  <h5 className="modal-title">Edit Hero Section</h5>
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
                          value={editingHero.english?.title || ""}
                          onChange={(e) =>
                            updateHeroField("title", e.target.value, "english")
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Content</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={editingHero.english?.content || ""}
                          onChange={(e) =>
                            updateHeroField(
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
                          value={editingHero.arabic?.title || ""}
                          onChange={(e) =>
                            updateHeroField("title", e.target.value, "arabic")
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">المحتوى</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={editingHero.arabic?.content || ""}
                          onChange={(e) =>
                            updateHeroField("content", e.target.value, "arabic")
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
                    onClick={handleSaveHero}
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
