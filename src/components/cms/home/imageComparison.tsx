"use client";

import { useState, useEffect } from "react";
import CommonFooter from "@/core/common/footer/commonFooter";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { FaEdit, FaImage } from "react-icons/fa";
import { ImageComparison } from "@/types/homeTypes/imageComparison";
import { imageComparisonService } from "@/services/HomeService/imageComparisonService";

export default function ImageComparisonManagement() {

  const [imageComparison, setImageComparison] =
    useState<ImageComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);



  useEffect(() => {
    loadImageComparison();
  }, []);



  const loadImageComparison = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await imageComparisonService.getImageComparison();
      setImageComparison(data.section);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load image comparison data"
      );
    } finally {
      setLoading(false);
    }
  };



  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBeforeImage(null);
    setAfterImage(null);
  };



  const handleBeforeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBeforeImage(e.target.files[0]);
    }
  };

  const handleAfterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAfterImage(e.target.files[0]);
    }
  };



  const handleSaveImages = async () => {
    if (!imageComparison) return;

    if (!beforeImage && !afterImage) {
      setError("Please select at least one image to update");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedData = await imageComparisonService.updateImageComparison(
        imageComparison._id,
        beforeImage || undefined,
        afterImage || undefined
      );

      setImageComparison(updatedData.section);

      setShowModal(false);
      setBeforeImage(null);
      setAfterImage(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update images");
    } finally {
      setLoading(false);
    }
  };



  if (loading && !imageComparison) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card">
            <div className="card-body text-center">
              <h5>Loading image comparison data...</h5>
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
                onClick={loadImageComparison}
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
            <h2 className="mb-1">Image Comparison Management</h2>
            <p>Manage your before/after comparison images</p>
          </div>
          <ul className="table-top-head">
            <li>
              <button
                className="btn btn-primary me-2"
                onClick={handleEditClick}
                disabled={loading}
              >
                <FaEdit className="me-1" /> Edit Images
              </button>
            </li>
            <CollapesIcon />
          </ul>
        </div>

        {imageComparison && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Current Images</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">Before Image</h6>
                  {imageComparison.images && imageComparison.images[0] ? (
                    <div className="text-center">
                      <img
                        src={imageComparison.images[0].secure_url}
                        alt="Before"
                        style={{
                          maxWidth: "100%",
                          height: "200px",
                          objectFit: "cover",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                        }}
                      />
                      <p className="text-muted mt-2 small">
                        Public ID: {imageComparison.images[0].public_id}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="text-center"
                      style={{
                        height: "200px",
                        backgroundColor: "#f8f9fa",
                        border: "1px dashed #dee2e6",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p className="text-muted">No before image available</p>
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <h6 className="text-success">After Image</h6>
                  {imageComparison.images && imageComparison.images[1] ? (
                    <div className="text-center">
                      <img
                        src={imageComparison.images[1].secure_url}
                        alt="After"
                        style={{
                          maxWidth: "100%",
                          height: "200px",
                          objectFit: "cover",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                        }}
                      />
                      <p className="text-muted mt-2 small">
                        Public ID: {imageComparison.images[1].public_id}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="text-center"
                      style={{
                        height: "200px",
                        backgroundColor: "#f8f9fa",
                        border: "1px dashed #dee2e6",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p className="text-muted">No after image available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Comparison Images</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary">
                        <FaImage className="me-2" />
                        Before Image
                      </h6>
                      <div className="mb-3">
                        <label className="form-label">
                          Select New Before Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleBeforeImageChange}
                        />
                        {beforeImage && (
                          <small className="text-muted">
                            Selected: {beforeImage.name}
                          </small>
                        )}
                      </div>

                      {imageComparison?.images && imageComparison.images[0] && (
                        <div className="mb-3">
                          <label className="form-label">
                            Current Before Image
                          </label>
                          <div className="text-center">
                            <img
                              src={imageComparison.images[0].secure_url}
                              alt="Current Before"
                              className="img-fluid rounded"
                              style={{ maxHeight: "150px" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <h6 className="text-success">
                        <FaImage className="me-2" />
                        After Image
                      </h6>
                      <div className="mb-3">
                        <label className="form-label">
                          Select New After Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleAfterImageChange}
                        />
                        {afterImage && (
                          <small className="text-muted">
                            Selected: {afterImage.name}
                          </small>
                        )}
                      </div>


                      {imageComparison?.images && imageComparison.images[1] && (
                        <div className="mb-3">
                          <label className="form-label">
                            Current After Image
                          </label>
                          <div className="text-center">
                            <img
                              src={imageComparison.images[1].secure_url}
                              alt="Current After"
                              className="img-fluid rounded"
                              style={{ maxHeight: "150px" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <strong>Note:</strong> You can update one or both images.
                    Leave an image field empty if you don&apos;t want to change it.
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
                    onClick={handleSaveImages}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Images"}
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
