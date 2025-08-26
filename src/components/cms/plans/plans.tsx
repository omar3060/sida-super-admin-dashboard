"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Plan } from "@/types/plansTypes/plan";
import { planService } from "@/services/planService/planService";

export default function PlansManagement() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);

      const data = await planService.getPlans();

      let plansArray: Plan[] = [];
      if (data.plans && Array.isArray(data.plans)) {
        plansArray = data.plans;
      } else if (Array.isArray(data)) {
        plansArray = data;
      } else {
        throw new Error("Invalid data format from API");
      }

      if (plansArray.length > 0) {
        const homeSectionIndex = plansArray.findIndex((plan) => {
          return plan.english.name === "homesection";
        });

        if (homeSectionIndex !== -1) {
          const remainingPlans = plansArray.filter((plan) => {
            return plan.english.name !== "homesection";
          });

          setPlans(remainingPlans);

          const homeSectionPlan = plansArray[homeSectionIndex];
          console.log("HomSection Plan:", homeSectionPlan);
          console.log("Remaining Plans:", remainingPlans);
        } else {
          setPlans(plansArray);
        }
      } else {
        setPlans([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const createEmptyPlan = (): Plan => ({
    _id: "",
    english: { name: "", description: "", features: [""] },
    arabic: { name: "", description: "", features: [""] },
    price: 0,
    activeFeatures: [],
  });

  const handleAddClick = () => {
    setEditingPlan(createEmptyPlan());
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditClick = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const handleDeleteClick = async (planId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this plan?"
    );
    if (!confirmDelete) return;

    try {
      await planService.deletePlan(planId);
      setPlans(plans.filter((plan) => plan._id !== planId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    }
  };

  const updatePlansAfterSave = (savedPlan: Plan, isNewPlan: boolean) => {
    if (isNewPlan) {
      setPlans([...plans, savedPlan]);
    } else {
      const updatedPlan = {
        _id: editingPlan?._id || savedPlan._id,
        english: {
          name: editingPlan?.english?.name || savedPlan.english?.name || "",
          description:
            editingPlan?.english?.description ||
            savedPlan.english?.description ||
            "",
          features:
            editingPlan?.english?.features || savedPlan.english?.features || [],
        },
        arabic: {
          name: editingPlan?.arabic?.name || savedPlan.arabic?.name || "",
          description:
            editingPlan?.arabic?.description ||
            savedPlan.arabic?.description ||
            "",
          features:
            editingPlan?.arabic?.features || savedPlan.arabic?.features || [],
        },
        price: editingPlan?.price || savedPlan.price || 0,
        activeFeatures:
          editingPlan?.activeFeatures || savedPlan.activeFeatures || [],
        __v: savedPlan.__v,
      };

      setPlans(
        plans.map((plan) =>
          plan._id === editingPlan?._id ? updatedPlan : plan
        )
      );
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    try {
      setLoading(true);
        setError(null);
      let savedPlan;

      if (editingPlan._id && editingPlan._id !== "") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, ...cleanPlan } = editingPlan;

        savedPlan = await planService.updatePlan(editingPlan._id, cleanPlan as Plan);
        updatePlansAfterSave(savedPlan, false);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, ...cleanPlan } = editingPlan;
        savedPlan = await planService.createPlan(cleanPlan as Plan);
        updatePlansAfterSave(savedPlan, true);
      }

      setShowModal(false);
      setEditingPlan(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  const updatePlanField = (
    field: string,
    value: string | number | string[] | number[],
    language?: "english" | "arabic"
  ) => {
    if (!editingPlan) return;

    if (language) {
      setEditingPlan({
        ...editingPlan,
        [language]: {
          ...editingPlan[language],
          [field]: value,
        },
      });
    } else {
      setEditingPlan({
        ...editingPlan,
        [field]: value,
      });
    }
  };

  const updateFeature = (
    index: number,
    value: string,
    language: "english" | "arabic"
  ) => {
    if (!editingPlan) return;

    const features = [...editingPlan[language].features];
    features[index] = value;

    updatePlanField("features", features, language);
  };

  const addFeature = (language: "english" | "arabic") => {
    if (!editingPlan) return;

    const features = [...editingPlan[language].features, ""];
    updatePlanField("features", features, language);
  };

  const removeFeature = (index: number, language: "english" | "arabic") => {
    if (!editingPlan || editingPlan[language].features.length <= 1) return;

    const features = editingPlan[language].features.filter(
      (_, i) => i !== index
    );
    updatePlanField("features", features, language);
  };

  const toggleFeatureActive = (index: number) => {
    if (!editingPlan) return;

    const currentActiveFeatures = editingPlan.activeFeatures || [];
    const activeFeatures = currentActiveFeatures.includes(index)
      ? currentActiveFeatures.filter((i) => i !== index)
      : [...currentActiveFeatures, index];

    updatePlanField("activeFeatures", activeFeatures);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading plans...</h5>
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
              <button className="btn btn-primary mt-2" onClick={loadPlans}>
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
            <h2 className="mb-1">Plans Management</h2>
            <p>Manage your website pricing plans</p>
          </div>
          <ul className="table-top-head">
            <li>
              <button className="btn btn-primary" onClick={handleAddClick}>
                <FaPlus className="me-1" /> Add New Plan
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
                    <th>ID</th>
                    <th>Name (EN)</th>
                    <th>Name (AR)</th>
                    <th>Price</th>
                    <th>Features</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length > 0 ? (
                    plans.map((plan) => (
                      <tr key={plan._id || "unknown"}>
                        <td>
                          {plan._id ? plan._id.substring(0, 8) + "..." : "N/A"}
                        </td>
                        <td>{plan.english?.name || "N/A"}</td>
                        <td>{plan.arabic?.name || "N/A"}</td>
                        <td>${plan.price || 0}</td>
                        <td>{plan.english?.features?.length || 0} features</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditClick(plan)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              if (plan._id) {
                                handleDeleteClick(plan._id);
                              }
                            }}
                            disabled={!plan._id}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No plans available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      
      {showModal && editingPlan && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? "Edit Plan" : "Add New Plan"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>

              <div className="modal-body">
                
                <div className="mb-3">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingPlan.price}
                    onChange={(e) =>
                      updatePlanField("price", Number(e.target.value))
                    }
                  />
                </div>

                
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#english"
                    >
                      English
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#arabic">
                      Arabic
                    </a>
                  </li>
                </ul>

                <div className="tab-content">
                  
                  <div className="tab-pane active" id="english">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingPlan.english?.name || ""}
                        onChange={(e) =>
                          updatePlanField("name", e.target.value, "english")
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={editingPlan.english?.description || ""}
                        onChange={(e) =>
                          updatePlanField(
                            "description",
                            e.target.value,
                            "english"
                          )
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Features</label>
                      {(editingPlan.english?.features || []).map(
                        (feature, index) => (
                          <div key={index} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={feature || ""}
                              onChange={(e) =>
                                updateFeature(index, e.target.value, "english")
                              }
                            />
                            <div className="input-group-text">
                              <input
                                type="checkbox"
                                checked={
                                  editingPlan.activeFeatures?.includes(index) ||
                                  false
                                }
                                onChange={() => toggleFeatureActive(index)}
                                className="form-check-input mt-0"
                              />
                            </div>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeFeature(index, "english")}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => addFeature("english")}
                      >
                        <FaPlus /> Add Feature
                      </button>
                    </div>
                  </div>

                      
                  <div className="tab-pane" id="arabic">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingPlan.arabic?.name || ""}
                        onChange={(e) =>
                          updatePlanField("name", e.target.value, "arabic")
                        }
                        dir="rtl"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={editingPlan.arabic?.description || ""}
                        onChange={(e) =>
                          updatePlanField(
                            "description",
                            e.target.value,
                            "arabic"
                          )
                        }
                        dir="rtl"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Features</label>
                      {(editingPlan.arabic?.features || []).map(
                        (feature, index) => (
                          <div key={index} className="input-group mb-2">
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeFeature(index, "arabic")}
                            >
                              <FaTrash />
                            </button>
                            <div className="input-group-text">
                              <input
                                type="checkbox"
                                checked={
                                  editingPlan.activeFeatures?.includes(index) ||
                                  false
                                }
                                onChange={() => toggleFeatureActive(index)}
                                className="form-check-input mt-0"
                              />
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              value={feature || ""}
                              onChange={(e) =>
                                updateFeature(index, e.target.value, "arabic")
                              }
                              dir="rtl"
                            />
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => addFeature("arabic")}
                      >
                        <FaPlus /> Add Feature
                      </button>
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
                  onClick={handleSavePlan}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CommonFooter />
    </div>
  );
}
