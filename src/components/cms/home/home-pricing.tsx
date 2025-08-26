"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit } from "react-icons/fa";
import { Plan } from "@/types/plansTypes/plan";
import { planService } from "@/services/planService/planService";

export default function HomePricingManagement() {

  const [firstPlan, setFirstPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    loadFirstPlan();
  }, []);


  const loadFirstPlan = async () => {
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
          const homeSectionPlan = plansArray[homeSectionIndex];
          setFirstPlan(homeSectionPlan);

          const remainingPlans = plansArray.filter((plan) => {
            return plan.english.name !== "homesection";
          });

          console.log("HomSection Plan:", homeSectionPlan);
          console.log("Remaining Plans:", remainingPlans);
        } else {

          setFirstPlan(null);
          setError("No homesection plan found");
        }
      } else {
        setFirstPlan(null);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load home plan");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (plan: Plan) => {
    setEditingPlan({ ...plan }); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };


  const updatePlanAfterSave = (savedPlan: Plan) => {

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

    setFirstPlan(updatedPlan);
  };


  const handleSavePlan = async () => {
    if (!editingPlan || !editingPlan._id) return;

    try {
      setLoading(true);
      setError(null);


      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, __v, ...cleanPlan } = editingPlan;

      const savedPlan = await planService.updatePlan(
        editingPlan._id,
        cleanPlan as Plan
      );
      updatePlanAfterSave(savedPlan);

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
              <h5>Loading home plan...</h5>
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
              <button className="btn btn-primary mt-2" onClick={loadFirstPlan}>
                Try Again
              </button>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }


  if (!firstPlan) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>No home plan found</h5>
              <p>Please add a plan first in the main plans section.</p>
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
            <h2 className="mb-1">Home Plan Management</h2>
            <p>Manage your website home pricing plan</p>
          </div>
          <ul className="table-top-head">
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
                  <tr key={firstPlan._id || "unknown"}>
                    <td>
                      {firstPlan._id
                        ? firstPlan._id.substring(0, 8) + "..."
                        : "N/A"}
                    </td>
                    <td>{firstPlan.english?.name || "N/A"}</td>
                    <td>{firstPlan.arabic?.name || "N/A"}</td>
                    <td>${firstPlan.price || 0}</td>
                    <td>{firstPlan.english?.features?.length || 0} features</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditClick(firstPlan)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
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
                <h5 className="modal-title">Edit Home Plan</h5>
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
                      {editingPlan.english?.features?.map((feature, index) => (
                        <div key={index} className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            value={feature}
                            onChange={(e) =>
                              updateFeature(index, e.target.value, "english")
                            }
                          />
                          <button
                            className="btn btn-outline-danger"
                            type="button"
                            onClick={() => removeFeature(index, "english")}
                            disabled={editingPlan.english.features.length <= 1}
                          >
                            Remove
                          </button>
                          <button
                            className={`btn ${
                              editingPlan.activeFeatures?.includes(index)
                                ? "btn-success"
                                : "btn-outline-secondary"
                            }`}
                            type="button"
                            onClick={() => toggleFeatureActive(index)}
                          >
                            {editingPlan.activeFeatures?.includes(index)
                              ? "Active"
                              : "Inactive"}
                          </button>
                        </div>
                      ))}
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() => addFeature("english")}
                      >
                        Add Feature
                      </button>
                    </div>
                  </div>

                  <div className="tab-pane" id="arabic">
                    <div className="mb-3">
                      <label className="form-label">Name (Arabic)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingPlan.arabic?.name || ""}
                        onChange={(e) =>
                          updatePlanField("name", e.target.value, "arabic")
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description (Arabic)</label>
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
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Features (Arabic)</label>
                      {editingPlan.arabic?.features?.map((feature, index) => (
                        <div key={index} className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            value={feature}
                            onChange={(e) =>
                              updateFeature(index, e.target.value, "arabic")
                            }
                          />
                          <button
                            className="btn btn-outline-danger"
                            type="button"
                            onClick={() => removeFeature(index, "arabic")}
                            disabled={editingPlan.arabic.features.length <= 1}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() => addFeature("arabic")}
                      >
                        Add Feature
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
