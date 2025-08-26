"use client";
/* eslint-disable @next/next/no-img-element */

import CommonFooter from '@/core/common/footer/commonFooter';
import CollapesIcon from '@/core/common/tooltip-content/collapes';
import RefreshIcon from '@/core/common/tooltip-content/refresh';
import React from 'react'
import Select from 'react-select';
import SettingsSideBar from '../settingssidebar';

export default function GdprSettingsComponent () {


    const position = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ];


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
                                <div className="card flex-fill mb-0">
                                    <form>
                                        <div className="card-header">
                                            <h4>GDPR Cookies</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="localization-info">
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <div className="setting-info">
                                                            <h6>Cookies Consent Text</h6>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <div className="mb-3">
                                                            <textarea
                                                                rows={4}
                                                                className="form-control"
                                                                placeholder="Type your message"
                                                                defaultValue={""}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row align-items-center">
                                                    <div className="col-sm-4">
                                                        <div className="setting-info">
                                                            <h6>Cookies Position</h6>
                                                            <p>Your can configure the type</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <div className="localization-select">
                                                            <Select
                                                                classNamePrefix="react-select"
                                                                options={position}
                                                                placeholder="Choose"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row align-items-center">
                                                    <div className="col-sm-4">
                                                        <div className="setting-info">
                                                            <h6>Agree Button Text</h6>
                                                            <p>Your can configure the text here</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <div className="localization-select d-flex align-items-center">
                                                            <div className="mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue="Agree"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row align-items-center">
                                                    <div className="col-sm-4">
                                                        <div className="setting-info">
                                                            <h6>Decline Button Text</h6>
                                                            <p>Your can configure the text here</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <div className="localization-select d-flex align-items-center">
                                                            <div className="mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue="Decline"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row align-items-center">
                                                    <div className="col-sm-4">
                                                        <div className="setting-info">
                                                            <h6>Show Decline Button</h6>
                                                            <p>Your can configure the text here</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <div className="localization-select d-flex align-items-center">
                                                            <div className="status-toggle modal-status d-flex justify-content-between align-items-center me-3">
                                                                <input
                                                                    type="checkbox"
                                                                    id="user4"
                                                                    className="check"
                                                                    defaultChecked
                                                                />
                                                                <label htmlFor="user4" className="checktoggle" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row align-items-center">
                                                    <div className="col-sm-4">
                                                        <div className="setting-info">
                                                            <h6>Link for Cookies Page</h6>
                                                            <p>Your can configure the link here</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="localization-select d-flex align-items-center w-100">
                                                            <div className="mb-3 w-100">
                                                                <input type="text" className="form-control" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-end">
                                                <button type="button" className="btn btn-secondary me-2">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </form>
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


