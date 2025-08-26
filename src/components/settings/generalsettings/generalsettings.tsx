
"use client";
/* eslint-disable @next/next/no-img-element */

import CollapesIcon from '@/core/common/tooltip-content/collapes';
import RefreshIcon from '@/core/common/tooltip-content/refresh';
import React from 'react'
import Select from "react-select";
import SettingsSideBar from '../settingssidebar';
import { City, Country, State } from '@/core/common/selectOption/selectOption';
import Link from 'next/link';
import CommonFooter from '@/core/common/footer/commonFooter';

export default function GeneralSettingsComponent  ()  {


    return (
        <div>
            <div className="page-wrapper">
                <div className="content settings-content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4 className="fw-bold">Settings</h4>
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
                                <div className="card flex-fill mb-0">
                                    <div className="card-header">
                                        <h4 className="fs-18 fw-bold">Profile</h4>
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className="card-title-head">
                                                <h6 className="fs-16 fw-bold mb-3">
                                                    <span className="fs-16 me-2">
                                                        <i className="ti ti-user" />
                                                    </span>
                                                    Basic Information
                                                </h6>
                                            </div>
                                            <div className="profile-pic-upload">
                                                <div className="profile-pic">
                                                    <span>
                                                        <i className="ti ti-circle-plus mb-1 fs-16" /> Add Image
                                                    </span>
                                                </div>
                                                <div className="new-employee-field">
                                                    <div className="mb-0">
                                                        <div className="image-upload mb-0">
                                                            <input type="file" />
                                                            <div className="image-uploads">
                                                                <h4>Upload Image</h4>
                                                            </div>
                                                        </div>
                                                        <span className="fs-13 fw-medium mt-2">
                                                            Upload an image below 2 MB, Accepted File format JPG,
                                                            PNG
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            First Name <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Last Name <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            User Name <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Phone Number <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Email <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="email" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-title-head">
                                                <h6 className="fs-16 fw-bold mb-3">
                                                    <span className="fs-16 me-2">
                                                        <i className="ti ti-map-pin" />
                                                    </span>
                                                    Address Information
                                                </h6>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Address <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="email" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Country <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={Country}
                                                            placeholder="Choose"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            State <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={State}
                                                            placeholder="Choose"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            City <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={City}
                                                            placeholder="Choose"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Postal Code <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-end settings-bottom-btn mt-0">
                                                <button type="button" className="btn btn-secondary me-2">
                                                    Cancel
                                                </button>
                                                <Link href="#" className="btn btn-primary">
                                                    Save Changes
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CommonFooter />
            </div>
        </div>
    )
}

