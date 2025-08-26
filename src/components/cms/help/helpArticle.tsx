"use client";

import React, { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaImage,
  FaVideo,
  FaList,
  FaFilter,
} from "react-icons/fa";
import { helpArticleService } from "@/services/helpService/helpArticleService";
import {
  HelpArticlesResponse,
  HelpArticleData,
} from "@/types/helpTypes/helpArticle";

const HelpArticleManagement: React.FC = () => {
  const [data, setData] = useState<HelpArticlesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<HelpArticleData | null>(
    null
  );
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [filteredArticles, setFilteredArticles] = useState<HelpArticleData[]>(
    []
  );

  const [articleFormData, setArticleFormData] = useState({
    article: { arabic: "", english: "" },
    titleArabic: "",
    titleEnglish: "",
    contentArabic: "",
    contentEnglish: "",
    stepsArabic: [""],
    stepsEnglish: [""],
  });

  useEffect(() => {
    loadHelpArticlesData();
  }, []);

  const loadHelpArticlesData = async () => {
    try {
      setLoading(true);
      const response = await helpArticleService.getHelpArticles();
      setData(response);
      setFilteredArticles(response.articles);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load help articles data"
      );
    } finally {
      setLoading(false);
    }
  };

  const getUniqueArticleIds = () => {
    if (!data) return [];
    const articleIds = data.articles.map((article) => article.article.english);
    return [...new Set(articleIds)].sort();
  };

  const handleFilterChange = (articleId: string) => {
    setSelectedFilter(articleId);
    if (articleId === "all") {
      setFilteredArticles(data?.articles || []);
    } else {
      const filtered =
        data?.articles.filter(
          (article) => article.article.english === articleId
        ) || [];
      setFilteredArticles(filtered);
    }
  };

  const handleCloseArticleModal = () => {
    setShowArticleModal(false);
    setEditingArticle(null);
    setIsEditingArticle(false);
    setSelectedCoverImage(null);
    setSelectedImage(null);
    setSelectedVideo(null);
    setArticleFormData({
      article: { arabic: "", english: "" },
      titleArabic: "",
      titleEnglish: "",
      contentArabic: "",
      contentEnglish: "",
      stepsArabic: [""],
      stepsEnglish: [""],
    });
  };

  const handleAddArticleClick = () => {
    setEditingArticle(null);
    setIsEditingArticle(false);
    setArticleFormData({
      article: { arabic: "", english: "" },
      titleArabic: "",
      titleEnglish: "",
      contentArabic: "",
      contentEnglish: "",
      stepsArabic: [""],
      stepsEnglish: [""],
    });
    setShowArticleModal(true);
  };

  const handleEditArticleClick = (article: HelpArticleData) => {
    setEditingArticle(article);
    setIsEditingArticle(true);
    setArticleFormData({
      article: {
        arabic: article.article.arabic,
        english: article.article.english,
      },
      titleArabic: article.arabic.title,
      titleEnglish: article.english.title,
      contentArabic: article.arabic.content,
      contentEnglish: article.english.content,
      stepsArabic: [...article.arabic.steps],
      stepsEnglish: [...article.english.steps],
    });
    setShowArticleModal(true);
  };

  const handleSaveArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      const arabicData = {
        title: articleFormData.titleArabic,
        content: articleFormData.contentArabic,
        steps: articleFormData.stepsArabic.filter((step) => step.trim() !== ""),
      };

      const englishData = {
        title: articleFormData.titleEnglish,
        content: articleFormData.contentEnglish,
        steps: articleFormData.stepsEnglish.filter(
          (step) => step.trim() !== ""
        ),
      };

      if (isEditingArticle && editingArticle) {
        await helpArticleService.updateHelpArticle(
          editingArticle._id,
          articleFormData.article,
          arabicData,
          englishData,
          selectedCoverImage || undefined,
          selectedImage || undefined,
          selectedVideo || undefined
        );
      } else {
        await helpArticleService.addHelpArticle(
          articleFormData.article,
          arabicData,
          englishData,
          selectedCoverImage || undefined,
          selectedImage || undefined,
          selectedVideo || undefined
        );
      }

      await loadHelpArticlesData();
      setShowArticleModal(false);
      setEditingArticle(null);
      setIsEditingArticle(false);
      setSelectedCoverImage(null);
      setSelectedImage(null);
      setSelectedVideo(null);
      setSelectedFilter("all");
      setArticleFormData({
        article: { arabic: "", english: "" },
        titleArabic: "",
        titleEnglish: "",
        contentArabic: "",
        contentEnglish: "",
        stepsArabic: [""],
        stepsEnglish: [""],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError(null);

      await helpArticleService.deleteHelpArticle(articleId);

      await loadHelpArticlesData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedCoverImage(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
    }
  };

  const handleArticleFormChange = (field: string, value: string) => {
    setArticleFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArticleIdChange = (
    language: "arabic" | "english",
    value: string
  ) => {
    setArticleFormData((prev) => ({
      ...prev,
      article: {
        ...prev.article,
        [language]: value,
      },
    }));
  };

  const handleStepsChange = (
    language: "arabic" | "english",
    index: number,
    value: string
  ) => {
    setArticleFormData((prev) => {
      const stepsField = language === "arabic" ? "stepsArabic" : "stepsEnglish";
      const newSteps = [...prev[stepsField]];
      newSteps[index] = value;
      return {
        ...prev,
        [stepsField]: newSteps,
      };
    });
  };

  const addStep = (language: "arabic" | "english") => {
    setArticleFormData((prev) => {
      const stepsField = language === "arabic" ? "stepsArabic" : "stepsEnglish";
      return {
        ...prev,
        [stepsField]: [...prev[stepsField], ""],
      };
    });
  };

  const removeStep = (language: "arabic" | "english", index: number) => {
    setArticleFormData((prev) => {
      const stepsField = language === "arabic" ? "stepsArabic" : "stepsEnglish";
      const newSteps = prev[stepsField].filter((_, i) => i !== index);
      return {
        ...prev,
        [stepsField]: newSteps.length > 0 ? newSteps : [""],
      };
    });
  };

  if (loading && !data) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading help articles data...</h5>
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
                onClick={loadHelpArticlesData}
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
            <h2 className="mb-1">Help Articles Management</h2>
            <p>Manage your website help articles content, images, and videos</p>
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
                  <option value="all">All Articles</option>
                  {getUniqueArticleIds().map((articleId) => (
                    <option key={articleId} value={articleId}>
                      {articleId}
                    </option>
                  ))}
                </select>
              </div>
            </li>
            <li>
              <button
                className="btn btn-success"
                onClick={handleAddArticleClick}
                disabled={loading}
              >
                <FaPlus className="me-1" /> Add Article
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
                    <th>Cover Image</th>
                    <th>Tutorial Image</th>
                    <th>Tutorial Video</th>
                    <th>Title (English)</th>
                    <th>Title (Arabic)</th>
                    <th>Content (English)</th>
                    <th>Content (Arabic)</th>
                    <th>Steps Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <tr
                        key={article._id}
                        onClick={() => handleEditArticleClick(article)}
                        style={{ cursor: "pointer" }}
                        className="table-row-clickable"
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditArticleClick(article)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteArticle(article._id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {article.article.english}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success" dir="rtl">
                            {article.article.arabic}
                          </span>
                        </td>
                        <td>
                          {article.cover && article.cover.secure_url ? (
                            <img
                              src={article.cover.secure_url}
                              alt="Article Cover"
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
                              No Cover
                            </div>
                          )}
                        </td>
                        <td>
                          {article.image && article.image.secure_url ? (
                            <img
                              src={article.image.secure_url}
                              alt="Article Image"
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
                        <td>
                          {article.vedio && article.vedio.secure_url ? (
                            <video
                              src={article.vedio.secure_url}
                              style={{
                                width: "60px",
                                height: "55px",
                                objectFit: "cover",
                              }}
                              className="rounded"
                              controls
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
                              No Video
                            </div>
                          )}
                        </td>
                        <td>{article.english.title}</td>
                        <td dir="rtl">{article.arabic.title}</td>
                        <td>
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "200px", display: "block" }}
                          >
                            {article.english.content}
                          </span>
                        </td>
                        <td dir="rtl">
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "200px", display: "block" }}
                          >
                            {article.arabic.content}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {article.english.steps.length} steps
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center">
                        {selectedFilter === "all"
                          ? "No articles available"
                          : `No articles found for "${selectedFilter}"`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showArticleModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditingArticle ? "Edit Article" : "Add New Article"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseArticleModal}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Article ID (English)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={articleFormData.article.english}
                      onChange={(e) =>
                        handleArticleIdChange("english", e.target.value)
                      }
                      placeholder="e.g., pos-sales, inventory-management"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Article ID (Arabic)</label>
                    <input
                      type="text"
                      className="form-control"
                      dir="rtl"
                      value={articleFormData.article.arabic}
                      onChange={(e) =>
                        handleArticleIdChange("arabic", e.target.value)
                      }
                      placeholder="مثال: مبيعات-نقاط-البيع، إدارة-المخزون"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      <FaImage className="me-2" />
                      Select Cover Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                    />
                    {selectedCoverImage && (
                      <small className="text-muted">
                        Selected: {selectedCoverImage.name}
                      </small>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <FaImage className="me-2" />
                      Select Tutorial Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {selectedImage && (
                      <small className="text-muted">
                        Selected: {selectedImage.name}
                      </small>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <FaVideo className="me-2" />
                      Select Tutorial Video
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="video/*"
                      onChange={handleVideoChange}
                    />
                    {selectedVideo && (
                      <small className="text-muted">
                        Selected: {selectedVideo.name}
                      </small>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">English Content</h6>
                    <div className="mb-3">
                      <label className="form-label">Title (English)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={articleFormData.titleEnglish}
                        onChange={(e) =>
                          handleArticleFormChange(
                            "titleEnglish",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Content (English)</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={articleFormData.contentEnglish}
                        onChange={(e) =>
                          handleArticleFormChange(
                            "contentEnglish",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        <FaList className="me-2" />
                        Steps (English)
                      </label>
                      {articleFormData.stepsEnglish.map((step, index) => (
                        <div key={index} className="d-flex mb-2">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={step}
                            onChange={(e) =>
                              handleStepsChange(
                                "english",
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Step ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeStep("english", index)}
                            disabled={articleFormData.stepsEnglish.length === 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => addStep("english")}
                      >
                        <FaPlus className="me-1" /> Add Step
                      </button>
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
                        value={articleFormData.titleArabic}
                        onChange={(e) =>
                          handleArticleFormChange("titleArabic", e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">المحتوى (العربية)</label>
                      <textarea
                        className="form-control"
                        dir="rtl"
                        rows={4}
                        value={articleFormData.contentArabic}
                        onChange={(e) =>
                          handleArticleFormChange(
                            "contentArabic",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        <FaList className="me-2" />
                        الخطوات (العربية)
                      </label>
                      {articleFormData.stepsArabic.map((step, index) => (
                        <div key={index} className="d-flex mb-2">
                          <input
                            type="text"
                            className="form-control me-2"
                            dir="rtl"
                            value={step}
                            onChange={(e) =>
                              handleStepsChange("arabic", index, e.target.value)
                            }
                            placeholder={`الخطوة ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeStep("arabic", index)}
                            disabled={articleFormData.stepsArabic.length === 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => addStep("arabic")}
                      >
                        <FaPlus className="me-1" /> إضافة خطوة
                      </button>
                    </div>
                  </div>
                </div>

                {isEditingArticle &&
                  editingArticle &&
                  (editingArticle.cover?.secure_url ||
                    editingArticle.image?.secure_url ||
                    editingArticle.vedio?.secure_url) && (
                    <div className="row mt-3">
                      {editingArticle.cover?.secure_url && (
                        <div className="col-md-4">
                          <label className="form-label">
                            Current Cover Image
                          </label>
                          <div className="text-center">
                            <img
                              src={editingArticle.cover.secure_url}
                              alt="Current cover"
                              className="img-fluid rounded"
                              style={{ maxHeight: "200px" }}
                            />
                          </div>
                        </div>
                      )}
                      {editingArticle.image?.secure_url && (
                        <div className="col-md-4">
                          <label className="form-label">
                            Current Tutorial Image
                          </label>
                          <div className="text-center">
                            <img
                              src={editingArticle.image.secure_url}
                              alt="Current tutorial image"
                              className="img-fluid rounded"
                              style={{ maxHeight: "200px" }}
                            />
                          </div>
                        </div>
                      )}
                      {editingArticle.vedio?.secure_url && (
                        <div className="col-md-4">
                          <label className="form-label">
                            Current Tutorial Video
                          </label>
                          <div className="text-center">
                            <video
                              src={editingArticle.vedio.secure_url}
                              className="img-fluid rounded"
                              style={{ maxHeight: "200px" }}
                              controls
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseArticleModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveArticle}
                >
                  {loading
                    ? "Saving..."
                    : isEditingArticle
                    ? "Update Article"
                    : "Add Article"}
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

export default HelpArticleManagement;
