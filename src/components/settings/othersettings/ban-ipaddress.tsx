"use client";
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */

/* eslint-disable @next/next/no-img-element */


import CollapesIcon from "@/core/common/tooltip-content/collapes";
import RefreshIcon from "@/core/common/tooltip-content/refresh";
import AddIpAddress from "@/core/modals/settings/addipaddress";
import EditIpAddress from "@/core/modals/settings/editipaddress";
import Link from "next/link";
import React from "react";
import SettingsSideBar from "../settingssidebar";


export default function BanIpaddressComponent () {



  return (
    <div>
      <div className="page-wrapper">
        <div className="content settings-content">
          <div className="page-header settings-pg-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Settings</h4>
                <h6>Manage your settings on portal</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <RefreshIcon />
              <CollapesIcon />
            </ul>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="settings-wrapper d-flex">
                <SettingsSideBar />
                <div className="card flex-fill mb-0 w-50">
                  <div className="card-header d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-0">Ban IP Address</h5>
                    <div className="flex-shrink-0">
                      <button
                        className="btn btn-primary add-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#add-banip"
                      >
                        <i className="ti ti-circle-plus me-1" />
                        Add Ban IP Address
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table">
                        <thead className="thead-light">
                          <tr>
                            <th>IP Address</th>
                            <th>Reason</th>
                            <th>Created On</th>
                            <th className="no-sort text-end" />
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-gray-9 fw-medium">211.11.0.25</td>
                            <td>
                              <p>Suspicious Activity</p>
                            </td>
                            <td>25 Apr 2025</td>
                            <td className="action-table-data justify-content-end">
                              <div className="edit-delete-action">
                                <Link
                                  className="me-2 p-2"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit-banip"
                                >
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                  className="p-2"
                                  href="javascript:void(0);"
                                >
                                  <i data-feather="trash-2" className="feather-trash-2" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-gray-9 fw-medium">211.03.0.11</td>
                            <td>
                              <p>Spam or Abuse</p>
                            </td>
                            <td>18 Mar 2025</td>
                            <td className="action-table-data justify-content-end">
                              <div className="edit-delete-action">
                                <Link
                                  className="me-2 p-2"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit-banip"
                                >
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                  className="p-2"
                                  href="javascript:void(0);"
                                >
                                  <i data-feather="trash-2" className="feather-trash-2" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-gray-9 fw-medium">211.24.0.17</td>
                            <td>
                              <p>Unauthorized Access</p>
                            </td>
                            <td>06 Feb 2025</td>
                            <td className="action-table-data justify-content-end">
                              <div className="edit-delete-action">
                                <Link
                                  className="me-2 p-2"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit-banip"
                                >
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                  className="p-2"
                                  href="javascript:void(0);"
                                >
                                  <i data-feather="trash-2" className="feather-trash-2" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-gray-9 fw-medium">211.12.0.34</td>
                            <td>
                              <p>Violation of Terms</p>
                            </td>
                            <td>02 Jan 2025</td>
                            <td className="action-table-data justify-content-end">
                              <div className="edit-delete-action">
                                <Link
                                  className="me-2 p-2"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit-banip"
                                >
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                  className="p-2"
                                  href="javascript:void(0);"
                                >
                                  <i data-feather="trash-2" className="feather-trash-2" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

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
      <AddIpAddress />
      <EditIpAddress />
      {/* delete modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content p-5 px-3 text-center">
                <span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
                  <i className="ti ti-trash fs-24 text-danger" />
                </span>
                <h4 className="fs-20 fw-bold mb-2 mt-1">Delete Ban IP Address</h4>
                <p className="mb-0 fs-16">
                  Are you sure you want to delete ban IP address?
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
                    className="btn btn-primary fs-13 fw-medium p-2 px-3"
                    data-bs-dismiss="modal"
                  >
                    Yes Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


