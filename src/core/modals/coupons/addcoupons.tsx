"use client";
import TextEditor from "@/core/common/texteditor/texteditor";
/* eslint-disable @next/next/no-img-element */

import { DatePicker } from "antd";
import { Calendar } from "feather-icons-react";
import Link from "next/link";
import React, { useState } from "react";
import Select from "react-select";

const AddCoupons = () => {
  const price = [
    { value: "choose", label: "Choose Type" },
    { value: "fixed", label: "Fixed" },
    { value: "percentage", label: "Percentage" },
  ];
  const list = [
    { value: "choose", label: "Choose" },
    { value: "nikeJordan", label: "Nike Jordan" },
    { value: "amazonEchoDot", label: "Amazon Echo Dot" },
  ];
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date:any) => {
    setSelectedDate(date);
  };
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date:any) => {
    setSelectedDate1(date);
  };
  return (
    <div>
      {/* Add coupons */}
      <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Coupons</h4>
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
                <div className="modal-body custom-modal-body">
                  <form>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Coupon Name<span className="text-danger ms-1">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Coupon Code<span className="text-danger ms-1">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Type<span className="text-danger ms-1">*</span></label>

                          <Select
                            classNamePrefix="react-select"
                            options={price}
                            placeholder="Choose Type"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Discount<span className="text-danger ms-1">*</span></label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label"> Limit<span className="text-danger ms-1">*</span></label>
                          <input type="text" className="form-control" />
                          <span className="unlimited-text">
                            0 for Unlimited
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Start Date<span className="text-danger ms-1">*</span></label>
                          <div className="input-groupicon calender-input">
                            <Calendar className="info-img" />
                            <DatePicker
                      className="form-control"
                      placeholder="dd/mm/yyyy"
                    />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>End Date<span className="text-danger ms-1">*</span></label>
                          <div className="input-groupicon calender-input">
                            <Calendar className="info-img" />
                            <DatePicker
                      className="form-control"
                      placeholder="dd/mm/yyyy"
                    />
                          </div>
                        </div>
                      </div>
                      <div className="input-blocks">
                        <div className="status-toggle modal-status d-flex justify-content-between align-items-center mb-2">
                          <span className="status-label">All Products</span>
                          <div className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              id="user4"
                              className="check"
                              defaultChecked={true}
                            />
                            <label
                              htmlFor="user4"
                              className="checktoggle mb-0 me-1"
                            />
                            <span className="customer-toggle">
                              Once Per Customer
                            </span>
                          </div>
                        </div>
                        <Select
                          classNamePrefix="react-select"
                          options={list}
                          placeholder="Choose"
                        />
                      </div>
                      <div className="mb-3 summer-description-box">
                        <label className="form-label">Description</label>
                        <TextEditor />
                        <p>Maximum 60 Words</p>
                      </div>

                      <div className="input-blocks m-0">
                        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                          <span className="status-label">Status</span>
                          <input
                            type="checkbox"
                            id="user3"
                            className="check"
                            defaultChecked
                          />
                          <label htmlFor="user3" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <Link href="#" data-bs-dismiss="modal" className="btn btn-submit">
                        Create Coupon
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Coupons */}
    </div>
  );
};

export default AddCoupons;
