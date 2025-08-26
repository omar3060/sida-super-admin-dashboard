"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import {
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import { HomeComponent } from "@/types/homeComponent";
import { homeComponentService } from "@/services/homeComponentService";

export default function HomeComponentsManagement() {
  const [components, setComponents] = useState<HomeComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load components on mount
  useEffect(() => {
    loadComponents();
  }, []);

  // Load components from API
  const loadComponents = async () => {
    try {
      setLoading(true);
      const data = await homeComponentService.getHomeComponents();

      // Sort by order
      const sortedComponents = data.sort((a, b) => a.order - b.order);
      setComponents(sortedComponents);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load components"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initialize default components if none exist
  const initializeComponents = async () => {
    try {
      setLoading(true);
      const defaultComponents =
        await homeComponentService.initializeDefaultComponents();
      setComponents(defaultComponents.sort((a, b) => a.order - b.order));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize components"
      );
    } finally {
      setLoading(false);
    }
  };

  // Move component up
  const moveUp = (index: number) => {
    if (index === 0) return;

    const newComponents = [...components];
    const temp = newComponents[index];
    newComponents[index] = newComponents[index - 1];
    newComponents[index - 1] = temp;

    // Update order numbers
    const updatedComponents = newComponents.map((component, idx) => ({
      ...component,
      order: idx + 1,
    }));

    setComponents(updatedComponents);
    setHasChanges(true);
  };

  // Move component down
  const moveDown = (index: number) => {
    if (index === components.length - 1) return;

    const newComponents = [...components];
    const temp = newComponents[index];
    newComponents[index] = newComponents[index + 1];
    newComponents[index + 1] = temp;

    // Update order numbers
    const updatedComponents = newComponents.map((component, idx) => ({
      ...component,
      order: idx + 1,
    }));

    setComponents(updatedComponents);
    setHasChanges(true);
  };

  // Toggle component visibility
  const toggleVisibility = async (componentId: string) => {
    try {
      const component = components.find((c) => c._id === componentId);
      if (!component) return;

      const updatedComponent =
        await homeComponentService.toggleComponentVisibility(
          componentId,
          !component.isActive
        );

      setComponents((prev) =>
        prev.map((c) => (c._id === componentId ? updatedComponent : c))
      );
      setHasChanges(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle visibility"
      );
    }
  };

  // Save all changes
  const saveChanges = async () => {
    try {
      setSaving(true);

      // Update order for all components
      const orderUpdates = components.map((component) => ({
        _id: component._id!,
        order: component.order,
      }));

      await homeComponentService.updateMultipleComponentsOrder(orderUpdates);
      setHasChanges(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Reset changes
  const resetChanges = () => {
    loadComponents();
    setHasChanges(false);
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading home components...</h5>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }

  // Show error screen
  if (error) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="text-danger">Error: {error}</h5>
              <button className="btn btn-primary mt-2" onClick={loadComponents}>
                Try Again
              </button>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }

  // Show initialization screen if no components
  if (components.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>No home components found</h5>
              <p>Click the button below to initialize default components.</p>
              <button
                className="btn btn-primary"
                onClick={initializeComponents}
              >
                Initialize Default Components
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
        {/* Page Header */}
        <div className="d-lg-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="mb-1">Home Components Management</h2>
            <p>Manage the order and visibility of home page components</p>
          </div>
          <div className="d-flex gap-2">
            {hasChanges && (
              <>
                <button
                  className="btn btn-outline-secondary"
                  onClick={resetChanges}
                  disabled={saving}
                >
                  <FaUndo className="me-2" />
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveChanges}
                  disabled={saving}
                >
                  <FaSave className="me-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
            <ul className="table-top-head">
              <CollapesIcon />
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="alert alert-info">
          <strong>Instructions:</strong>
          <ul className="mb-0 mt-2">
            <li>
              Use the up/down arrows to reorder components on the home page
            </li>
            <li>Use the eye icon to show/hide components</li>
            <li>Click "Save Changes" to apply your modifications</li>
          </ul>
        </div>

        {/* Components List */}
        <div className="card">
          <div className="card-body">
            <div className="list-group">
              {components.map((component, index) => (
                <div
                  key={component._id}
                  className="list-group-item d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex flex-column">
                      <button
                        className="btn btn-sm btn-outline-secondary mb-1"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => moveDown(index)}
                        disabled={index === components.length - 1}
                        title="Move Down"
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                    <div>
                      <h6 className="mb-1">{component.displayName.english}</h6>
                      <small className="text-muted">
                        {component.displayName.arabic}
                      </small>
                      <br />
                      <small className="text-muted">
                        Order: {component.order} | Key: {component.componentKey}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge ${
                        component.isActive ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {component.isActive ? "Active" : "Hidden"}
                    </span>
                    <button
                      className={`btn btn-sm ${
                        component.isActive
                          ? "btn-outline-warning"
                          : "btn-outline-success"
                      }`}
                      onClick={() => toggleVisibility(component._id!)}
                      title={
                        component.isActive ? "Hide component" : "Show component"
                      }
                    >
                      {component.isActive ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">Preview</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {components
                .filter((c) => c.isActive)
                .sort((a, b) => a.order - b.order)
                .map((component) => (
                  <div key={component._id} className="col-md-6 col-lg-4 mb-3">
                    <div className="card border">
                      <div className="card-body text-center">
                        <h6>{component.displayName.english}</h6>
                        <small className="text-muted">
                          Order: {component.order}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
}
