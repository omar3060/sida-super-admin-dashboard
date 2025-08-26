"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import Select from "react-select";
import Table from "@/core/common/pagination/datatable";
import Link from "next/link";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import RefreshIcon from "@/core/common/tooltip-content/refresh";
import TooltipIcons from "@/core/common/tooltip-content/tooltipIcons";
import { PlusCircle, Edit } from "feather-icons-react";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  separateTestimonials,
} from "@/services/sharedService/testimonialsService";
import {
  Testimonial,
  TestimonialHeader,
  TestimonialCard,
  TestimonialLanguage,
} from "@/types/sharedTypes/testimonials";

export default function TestimonialComponent() {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  const [header, setHeader] = useState<TestimonialHeader | null>(null);
  const [testimonialCards, setTestimonialCards] = useState<TestimonialCard[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState<"arabic" | "english">(
    "english"
  );

  // Header form states
  const [headerTitle, setHeaderTitle] = useState({ arabic: "", english: "" });
  const [headerContent, setHeaderContent] = useState({
    arabic: "",
    english: "",
  });
  const [headerImage, setHeaderImage] = useState<File | null>(null);

  // Testimonial form states
  const [testimonialForm, setTestimonialForm] = useState({
    name: { arabic: "", english: "" },
    text: { arabic: "", english: "" },
    company: { arabic: "", english: "" },
    image: null as File | null,
  });
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialCard | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const testimonials = await getTestimonials();
      const { header: testimonialHeader, cards } =
        separateTestimonials(testimonials);

      setAllTestimonials(testimonials);
      setHeader(testimonialHeader);
      setTestimonialCards(cards);

      // Set header form data if header exists
      if (testimonialHeader) {
        setHeaderTitle({
          arabic: testimonialHeader.arabic.text,
          english: testimonialHeader.english.text,
        });
        setHeaderContent({
          arabic: testimonialHeader.arabic.company,
          english: testimonialHeader.english.company,
        });
      }
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHeader = async () => {
    if (!header) return;

    try {
      const arabicData: TestimonialLanguage = {
        text: headerTitle.arabic,
        name: "header",
        company: headerContent.arabic,
      };
      const englishData: TestimonialLanguage = {
        text: headerTitle.english,
        name: "header",
        company: headerContent.english,
      };

      await updateTestimonial(
        header._id,
        headerImage || undefined,
        arabicData,
        englishData
      );
      await loadTestimonials();
      setHeaderImage(null);

      // Close modal
      const modal = document.getElementById("edit-header-modal");
      if (modal) {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(
          modal
        );
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
    } catch (error) {
      console.error("Error updating header:", error);
    }
  };

  const handleAddTestimonial = async () => {
    try {
      if (!testimonialForm.image) return;

      const arabicData: TestimonialLanguage = {
        text: testimonialForm.text.arabic,
        name: testimonialForm.name.arabic,
        company: testimonialForm.company.arabic,
      };
      const englishData: TestimonialLanguage = {
        text: testimonialForm.text.english,
        name: testimonialForm.name.english,
        company: testimonialForm.company.english,
      };

      await addTestimonial(testimonialForm.image, arabicData, englishData);
      await loadTestimonials();

      // Reset form
      setTestimonialForm({
        name: { arabic: "", english: "" },
        text: { arabic: "", english: "" },
        company: { arabic: "", english: "" },
        image: null,
      });

      // Close modal
      const modal = document.getElementById("add-testimonial");
      if (modal) {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(
          modal
        );
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
    }
  };

  const handleEditTestimonial = (testimonial: TestimonialCard) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: {
        arabic: testimonial.arabic.name,
        english: testimonial.english.name,
      },
      text: {
        arabic: testimonial.arabic.text,
        english: testimonial.english.text,
      },
      company: {
        arabic: testimonial.arabic.company,
        english: testimonial.english.company,
      },
      image: null,
    });
  };

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial) return;

    try {
      const arabicData: TestimonialLanguage = {
        text: testimonialForm.text.arabic,
        name: testimonialForm.name.arabic,
        company: testimonialForm.company.arabic,
      };
      const englishData: TestimonialLanguage = {
        text: testimonialForm.text.english,
        name: testimonialForm.name.english,
        company: testimonialForm.company.english,
      };

      await updateTestimonial(
        editingTestimonial._id,
        testimonialForm.image || undefined,
        arabicData,
        englishData
      );
      await loadTestimonials();

      setEditingTestimonial(null);
      setTestimonialForm({
        name: { arabic: "", english: "" },
        text: { arabic: "", english: "" },
        company: { arabic: "", english: "" },
        image: null,
      });

      // Close modal
      const modal = document.getElementById("edit-testimonial");
      if (modal) {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(
          modal
        );
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      await deleteTestimonial(testimonialId);
      await loadTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const columns = [
    {
      title: "Author",
      dataIndex: "Author",
      render: (text: any, data: TestimonialCard) => (
        <div className="d-flex align-items-center">
          <Link href="#" className="avatar avatar-md">
            <img src={data.image.secure_url} className="img-fluid" alt="img" />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link href="#">
                {activeLanguage === "arabic"
                  ? data.arabic.name
                  : data.english.name}
              </Link>
            </p>
          </div>
        </div>
      ),
      
    },
    {
      title: "Company",
      dataIndex: "Company",
      render: (text: any, data: TestimonialCard) => (
        <span>
          {activeLanguage === "arabic"
            ? data.arabic.company
            : data.english.company}
        </span>
      ),
      
    },
    {
      title: "Testimonial Text",
      dataIndex: "Text",
      render: (text: any, data: TestimonialCard) => (
        <span
          className="text-truncate"
          style={{ maxWidth: "300px", display: "block" }}
        >
          {activeLanguage === "arabic" ? data.arabic.text : data.english.text}
        </span>
      ),
      
    },
    
    {
      title: "",
      dataIndex: "action",
      className: "action-table-data",
      render: (text: any, data: TestimonialCard) => (
        <div className="edit-delete-action">
          <Link
            className="me-2 p-2"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-testimonial"
            onClick={() => handleEditTestimonial(data)}
          >
            <i data-feather="edit" className="feather-edit" />
          </Link>
          <Link
            data-bs-toggle="modal"
            data-bs-target="#delete-modal"
            className="p-2"
            href="#"
            onClick={() => setEditingTestimonial(data)}
          >
            <i data-feather="trash-2" className="feather-trash-2" />
          </Link>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Testimonials</h4>
                <h6>Manage your testimonials</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <CollapesIcon />
            </ul>
            <div className="page-btn">
              <Link
                href="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-testimonial"
              >
                <PlusCircle data-feather="plus-circle" className="me-1" />
                Add Testimonial
              </Link>
            </div>
          </div>

          {/* Header Section */}
          {header && (
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Testimonials Section Header</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#edit-header-modal"
                >
                  <Edit size={16} className="me-1" />
                  Edit Header
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      
                      <div>
                        <h6 className="mb-1">
                          {activeLanguage === "arabic"
                            ? header.arabic.text
                            : header.english.text}
                        </h6>
                        <p className="text-muted mb-0">
                          {activeLanguage === "arabic"
                            ? header.arabic.company
                            : header.english.company}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-end">
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            activeLanguage === "english"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setActiveLanguage("english")}
                        >
                          English
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            activeLanguage === "arabic"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setActiveLanguage("arabic")}
                        >
                          العربية
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Testimonials Table */}
          <div className="card table-list-card">
            
            <div className="card-body pb-0">
              <div className="table-responsive">
                <Table columns={columns} dataSource={testimonialCards} />
              </div>
            </div>
          </div>
        </div>

        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014-2025 © DreamsPOS. All Right Reserved</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link href="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>

      {/* Edit Header Modal */}
      <div className="modal fade" id="edit-header-modal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Testimonials Header</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              
              {/* Language Tabs */}
              <ul className="nav nav-tabs" id="headerTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="english-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#english-content"
                    type="button"
                    role="tab"
                  >
                    English
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="arabic-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#arabic-content"
                    type="button"
                    role="tab"
                  >
                    العربية
                  </button>
                </li>
              </ul>

              <div className="tab-content" id="headerTabsContent">
                {/* English Tab */}
                <div
                  className="tab-pane fade show active"
                  id="english-content"
                  role="tabpanel"
                >
                  <div className="row mt-3">
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Title (English){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={headerTitle.english}
                        onChange={(e) =>
                          setHeaderTitle({
                            ...headerTitle,
                            english: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Content (English){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={headerContent.english}
                        onChange={(e) =>
                          setHeaderContent({
                            ...headerContent,
                            english: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Arabic Tab */}
                <div
                  className="tab-pane fade"
                  id="arabic-content"
                  role="tabpanel"
                >
                  <div className="row mt-3">
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        العنوان (العربية){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        dir="rtl"
                        value={headerTitle.arabic}
                        onChange={(e) =>
                          setHeaderTitle({
                            ...headerTitle,
                            arabic: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        المحتوى (العربية){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        dir="rtl"
                        rows={3}
                        value={headerContent.arabic}
                        onChange={(e) =>
                          setHeaderContent({
                            ...headerContent,
                            arabic: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary fs-13 fw-medium p-2 px-3"
                onClick={handleUpdateHeader}
              >
                Update Header
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Testimonial Modal */}
      <div className="modal fade" id="add-testimonial">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Testimonial</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="new-employee-field">
                <div className="profile-pic-upload">
                  <div className="profile-pic">
                    <span>
                      <PlusCircle
                        data-feather="plus-circle"
                        className="plus-down-add"
                      />
                      Add Image
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="image-upload mb-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            image: e.target.files?.[0] || null,
                          })
                        }
                      />
                      <div className="image-uploads">
                        <h4>Upload Image</h4>
                      </div>
                    </div>
                    <p className="mt-2">JPEG, PNG up to 2 MB</p>
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <ul
                className="nav nav-tabs"
                id="addTestimonialTabs"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="add-english-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#add-english-content"
                    type="button"
                    role="tab"
                  >
                    English
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="add-arabic-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#add-arabic-content"
                    type="button"
                    role="tab"
                  >
                    العربية
                  </button>
                </li>
              </ul>

              <div className="tab-content" id="addTestimonialTabsContent">
                {/* English Tab */}
                <div
                  className="tab-pane fade show active"
                  id="add-english-content"
                  role="tabpanel"
                >
                  <div className="row mt-3">
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Name (English){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={testimonialForm.name.english}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            name: {
                              ...testimonialForm.name,
                              english: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Company (English){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={testimonialForm.company.english}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            company: {
                              ...testimonialForm.company,
                              english: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Testimonial Text (English){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={testimonialForm.text.english}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            text: {
                              ...testimonialForm.text,
                              english: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Arabic Tab */}
                <div
                  className="tab-pane fade"
                  id="add-arabic-content"
                  role="tabpanel"
                >
                  <div className="row mt-3">
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        الاسم (العربية){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        dir="rtl"
                        value={testimonialForm.name.arabic}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            name: {
                              ...testimonialForm.name,
                              arabic: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        الشركة (العربية){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        dir="rtl"
                        value={testimonialForm.company.arabic}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            company: {
                              ...testimonialForm.company,
                              arabic: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        نص الشهادة (العربية){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        dir="rtl"
                        rows={3}
                        value={testimonialForm.text.arabic}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            text: {
                              ...testimonialForm.text,
                              arabic: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary fs-13 fw-medium p-2 px-3"
                onClick={handleAddTestimonial}
              >
                Add Testimonial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Testimonial Modal */}
      <div className="modal fade" id="edit-testimonial">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Testimonial</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="new-employee-field">
                <div className="profile-pic-upload">
                  <div className="profile-pic">
                    <span>
                      <PlusCircle
                        data-feather="plus-circle"
                        className="plus-down-add"
                      />
                      Update Image
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="image-upload mb-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            image: e.target.files?.[0] || null,
                          })
                        }
                      />
                      <div className="image-uploads">
                        <h4>Upload Image</h4>
                      </div>
                    </div>
                    <p className="mt-2">JPEG, PNG up to 2 MB</p>
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <ul
                className="nav nav-tabs"
                id="editTestimonialTabs"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="edit-english-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#edit-english-content"
                    type="button"
                    role="tab"
                  >
                    English
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="edit-arabic-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#edit-arabic-content"
                    type="button"
                    role="tab"
                  >
                    العربية
                  </button>
                </li>
              </ul>

              <div className="tab-content" id="editTestimonialTabsContent">
                {/* English Tab */}
                <div
                  className="tab-pane fade show active"
                  id="edit-english-content"
                  role="tabpanel"
                >
                  <div className="row mt-3">
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Name (English){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={testimonialForm.name.english}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            name: {
                              ...testimonialForm.name,
                              english: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Company (English){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={testimonialForm.company.english}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            company: {
                              ...testimonialForm.company,
                              english: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Testimonial Text (English){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={testimonialForm.text.english}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            text: {
                              ...testimonialForm.text,
                              english: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Arabic Tab */}
                <div
                  className="tab-pane fade"
                  id="edit-arabic-content"
                  role="tabpanel"
                >
                  <div className="row mt-3">
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        الاسم (العربية){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        dir="rtl"
                        value={testimonialForm.name.arabic}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            name: {
                              ...testimonialForm.name,
                              arabic: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        الشركة (العربية){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        dir="rtl"
                        value={testimonialForm.company.arabic}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            company: {
                              ...testimonialForm.company,
                              arabic: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        نص الشهادة (العربية){" "}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        dir="rtl"
                        rows={3}
                        value={testimonialForm.text.arabic}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            text: {
                              ...testimonialForm.text,
                              arabic: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary fs-13 fw-medium p-2 px-3"
                onClick={handleUpdateTestimonial}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content p-5 px-3 text-center">
                <span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
                  <i className="ti ti-trash fs-24 text-danger" />
                </span>
                <h4 className="fs-20 text-gray-9 fw-bold mb-2 mt-1">
                  Delete Testimonial
                </h4>
                <p className="text-gray-6 mb-0 fs-16">
                  Are you sure you want to delete this testimonial?
                </p>
                <div className="modal-footer-btn mt-3 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-submit fs-13 fw-medium p-2 px-3"
                    onClick={() =>
                      editingTestimonial &&
                      handleDeleteTestimonial(editingTestimonial._id)
                    }
                  >
                    Yes Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
