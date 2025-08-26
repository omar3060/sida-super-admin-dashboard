"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  FooterSection,
  FooterLink,
  SocialLink,
  FOOTER_CATEGORIES,
} from "@/types/homeTypes/footer";
import {
  footerSectionService,
  footerLinksService,
  socialLinksService,
} from "@/services/HomeService/footerService";

export default function FooterManagement() {
  // State Management
  const [footerSection, setFooterSection] = useState<FooterSection | null>(
    null
  );
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Footer Section Modal State
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(
    null
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Footer Links Modal State
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Social Links Modal State
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSocial, setEditingSocial] =
    useState<Partial<SocialLink> | null>(null);
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  // Lifecycle Effects
  useEffect(() => {
    loadAllData();
  }, []);

  // Data Loading
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sectionData, linksData, socialData] = await Promise.all([
        footerSectionService.getFooterSection(),
        footerLinksService.getFooterLinks(),
        socialLinksService.getSocialLinks(),
      ]);

      setFooterSection(sectionData);
      setFooterLinks(linksData.links);
      setSocialLinks(socialData.socialLinks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load footer data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Footer Section Management
  const handleEditSection = () => {
    if (footerSection) {
      setEditingSection({ ...footerSection });
      setShowSectionModal(true);
    }
  };

  const handleCloseSectionModal = () => {
    setShowSectionModal(false);
    setEditingSection(null);
    setSelectedFiles([]);
  };

  const updateSectionField = (
    field: string,
    value: string,
    language: "english" | "arabic"
  ) => {
    if (!editingSection) return;

    setEditingSection({
      ...editingSection,
      [language]: {
        ...editingSection[language],
        [field]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSaveSection = async () => {
    if (!editingSection) return;

    try {
      setLoading(true);
      setError(null);

      await footerSectionService.updateFooterSection(
        editingSection,
        selectedFiles.length > 0 ? selectedFiles : undefined
      );

      const updatedSection = await footerSectionService.getFooterSection();

      setFooterSection(updatedSection);
      handleCloseSectionModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update footer section"
      );
    } finally {
      setLoading(false);
    }
  };

  // Footer Links Management
  const handleAddLink = () => {
    const newLink = {
      _id: `temp_${Date.now()}`,
      arabic: { title: "" },
      english: { title: "" },
      link: "",
      category: "company" as const,
    };
    setEditingLink(newLink);
    setIsAddingLink(true);
    setShowLinksModal(true);
  };

  const handleEditLink = (link: FooterLink) => {
    setEditingLink({ ...link });
    setIsAddingLink(false);
    setShowLinksModal(true);
  };

  const handleCloseLinksModal = () => {
    setShowLinksModal(false);
    setEditingLink(null);
    setIsAddingLink(false);
  };

  const updateLinkField = (
    field: string,
    value: string,
    language?: "english" | "arabic"
  ) => {
    if (!editingLink) return;

    if (language) {
      setEditingLink({
        ...editingLink,
        [language]: {
          ...editingLink[language],
          [field]: value,
        },
      });
    } else {
      setEditingLink({
        ...editingLink,
        [field]: value,
      });
    }
  };

  const handleSaveLink = async () => {
    if (!editingLink) return;

    if (
      !editingLink.arabic.title ||
      !editingLink.english.title ||
      !editingLink.link
    ) {
      alert(
        "Please fill in all required fields (Arabic title, English title, and link)"
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isAddingLink) {
        const linkToAdd = {
          arabic: editingLink.arabic,
          english: editingLink.english,
          link: editingLink.link,
          category: editingLink.category,
        };

        const newLink = await footerLinksService.addFooterLink(linkToAdd);

        if (newLink._id?.startsWith("temp_")) {
          const refreshedData = await footerLinksService.getFooterLinks();
          setFooterLinks(refreshedData.links);
        } else {
          setFooterLinks((prev) => [...prev, newLink]);
        }

      } else {
        const linkToUpdate = {
          arabic: editingLink.arabic,
          english: editingLink.english,
          link: editingLink.link,
        };

        const updatedLink = await footerLinksService.updateFooterLink(
          editingLink._id!,
          linkToUpdate
        );
        setFooterLinks((prev) =>
          prev.map((link) =>
            link._id === editingLink._id ? updatedLink : link
          )
        );
      }

      handleCloseLinksModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save footer link"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      setLoading(true);
      setError(null);

      await footerLinksService.deleteFooterLink(linkId);
      setFooterLinks((prev) => prev.filter((link) => link._id !== linkId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete footer link"
      );
    } finally {
      setLoading(false);
    }
  };

  // Social Links Management
  const handleAddSocial = () => {
    const newSocial = {
      _id: `temp_${Date.now()}`,
      link: "",
      icon: "",
      display: false,
    };
    setEditingSocial(newSocial);
    setIsAddingSocial(true);
    setShowSocialModal(true);
  };

  const handleEditSocial = (social: SocialLink) => {
    setEditingSocial({ ...social });
    setIsAddingSocial(false);
    setShowSocialModal(true);
  };

  const handleCloseSocialModal = () => {
    setShowSocialModal(false);
    setEditingSocial(null);
    setIsAddingSocial(false);
  };

  const updateSocialField = (field: string, value: string | boolean) => {
    if (!editingSocial) return;

    setEditingSocial({
      ...editingSocial,
      [field]: value,
    });
  };

  const handleSaveSocial = async () => {
    if (!editingSocial) return;

    if (!editingSocial.icon || !editingSocial.link) {
      alert("Please fill in all required fields (Icon name and Link URL)");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isAddingSocial) {
        const socialToAdd = {
          link: editingSocial.link!,
          icon: editingSocial.icon!,
          display: editingSocial.display ?? false,
        };

        const newSocial = await socialLinksService.addSocialLink(socialToAdd);

        if (newSocial._id?.startsWith("temp_")) {
          const refreshedData = await socialLinksService.getSocialLinks();
          setSocialLinks(refreshedData.socialLinks);
        } else {
          setSocialLinks((prev) => [...prev, newSocial]);
        }

      } else {
        const socialToUpdate = {
          link: editingSocial.link!,
          icon: editingSocial.icon!,
          display: editingSocial.display ?? false,
        };

        const updatedSocial = await socialLinksService.updateSocialLink(
          editingSocial._id!,
          socialToUpdate
        );
        setSocialLinks((prev) =>
          prev.map((social) =>
            social._id === editingSocial._id ? updatedSocial : social
          )
        );
      }

      handleCloseSocialModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save social link"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSocial = async (socialId: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;

    try {
      setLoading(true);
      setError(null);

      await socialLinksService.deleteSocialLink(socialId);
      setSocialLinks((prev) =>
        prev.filter((social) => social._id !== socialId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete social link"
      );
    } finally {
      setLoading(false);
    }
  };

  if (
    loading &&
    !footerSection &&
    footerLinks.length === 0 &&
    socialLinks.length === 0
  ) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading footer data...</h5>
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
              <button className="btn btn-primary mt-2" onClick={loadAllData}>
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
            <h2 className="mb-1">Footer Management</h2>
            <p>Manage your website footer section, links, and social media</p>
          </div>
          <CollapesIcon />
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Footer Section</h5>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleEditSection}
              disabled={loading}
            >
              <FaEdit className="me-1" /> Edit Section
            </button>
          </div>
          <div className="card-body">
            {footerSection ? (
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">English</h6>
                  <p>
                    <strong>Title:</strong>{" "}
                    {footerSection.english?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Content:</strong>{" "}
                    {footerSection.english?.content || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Arabic</h6>
                  <p>
                    <strong>العنوان:</strong>{" "}
                    {footerSection.arabic?.title || "غير متوفر"}
                  </p>
                  <p>
                    <strong>المحتوى:</strong>{" "}
                    {footerSection.arabic?.content || "غير متوفر"}
                  </p>
                </div>
                {footerSection.images && footerSection.images.length > 0 && (
                  <div className="col-12 mt-3">
                    <h6 className="text-info">Images</h6>
                    <div className="row">
                      {footerSection.images.map((image) => (
                        <div key={image._id} className="col-md-3">
                          <img
                            src={image.secure_url}
                            alt="Footer"
                            className="img-fluid rounded"
                            style={{ maxHeight: "100px" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted">No footer section data available</p>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Footer Links</h5>
            <button
              className="btn btn-success btn-sm"
              onClick={handleAddLink}
              disabled={loading}
            >
              <FaPlus className="me-1" /> Add Link
            </button>
          </div>
          <div className="card-body">
            <div className="row">
              {FOOTER_CATEGORIES.map((category) => {
                const categoryLinks = footerLinks.filter(
                  (link) => link.category === category.value
                );
                return (
                  <div key={category.value} className="col-md-6 col-lg-3 mb-3">
                    <div className="border rounded p-3">
                      <h6 className="text-primary">{category.label}</h6>
                      {categoryLinks.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {categoryLinks.map((link) => (
                            <div key={link._id} className="list-group-item p-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <small className="fw-bold d-block">
                                    {link.arabic.title}
                                  </small>
                                  <small className="text-muted d-block">
                                    {link.english.title}
                                  </small>
                                  <small className="text-primary d-block text-truncate">
                                    {link.link}
                                  </small>
                                </div>
                                <div className="btn-group btn-group-sm ms-2">
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleEditLink(link)}
                                    title="Edit"
                                  >
                                    <FaEdit size={12} />
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() =>
                                      handleDeleteLink(link._id)
                                    }
                                    title="Delete"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted small">
                          No links in this category
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Social Media Links</h5>
            <button
              className="btn btn-success btn-sm"
              onClick={handleAddSocial}
              disabled={loading}
            >
              <FaPlus className="me-1" /> Add Social Link
            </button>
          </div>
          <div className="card-body">
            {socialLinks.length > 0 ? (
              <div className="row">
                {socialLinks.map((social) => (
                  <div key={social._id} className="col-md-6 col-lg-4 mb-3">
                    <div className="border rounded p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{social.icon}</h6>
                          <small className="text-primary d-block text-truncate">
                            {social.link}
                          </small>
                          <span
                            className={`badge ${
                              social.display ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {social.display ? "Displayed" : "Hidden"}
                          </span>
                        </div>
                        <div className="btn-group btn-group-sm ms-2">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEditSocial(social)}
                            title="Edit"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteSocial(social._id)}
                            title="Delete"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No social media links available</p>
            )}
          </div>
        </div>

        {showSectionModal && editingSection && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Footer Section</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseSectionModal}
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
                          value={editingSection.english?.title || ""}
                          onChange={(e) =>
                            updateSectionField(
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
                          value={editingSection.english?.content || ""}
                          onChange={(e) =>
                            updateSectionField(
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
                          value={editingSection.arabic?.title || ""}
                          onChange={(e) =>
                            updateSectionField(
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
                          value={editingSection.arabic?.content || ""}
                          onChange={(e) =>
                            updateSectionField(
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
                      <h6 className="text-info">Update Images (optional)</h6>
                      <div className="mb-3">
                        <label className="form-label">Select New Images</label>
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        {selectedFiles.length > 0 && (
                          <small className="text-muted">
                            Selected: {selectedFiles.length} file(s)
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
                    onClick={handleCloseSectionModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveSection}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLinksModal && editingLink && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isAddingLink ? "Add New Footer Link" : "Edit Footer Link"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseLinksModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={editingLink.category}
                      onChange={(e) =>
                        updateLinkField("category", e.target.value)
                      }
                    >
                      {FOOTER_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Arabic Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingLink.arabic.title}
                      onChange={(e) =>
                        updateLinkField("title", e.target.value, "arabic")
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">English Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingLink.english.title}
                      onChange={(e) =>
                        updateLinkField("title", e.target.value, "english")
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Link URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={editingLink.link}
                      onChange={(e) => updateLinkField("link", e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseLinksModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveLink}
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : isAddingLink
                      ? "Add Link"
                      : "Update Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSocialModal && editingSocial && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isAddingSocial
                      ? "Add New Social Link"
                      : "Edit Social Link"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseSocialModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Icon Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., facebook, twitter, instagram"
                      value={editingSocial.icon}
                      onChange={(e) =>
                        updateSocialField("icon", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Link URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={editingSocial.link}
                      onChange={(e) =>
                        updateSocialField("link", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseSocialModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveSocial}
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : isAddingSocial
                      ? "Add Social Link"
                      : "Update Social Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {(showSectionModal || showLinksModal || showSocialModal) && (
          <div className="modal-backdrop show"></div>
        )}
      </div>
      <CommonFooter />
    </div>
  );
}
