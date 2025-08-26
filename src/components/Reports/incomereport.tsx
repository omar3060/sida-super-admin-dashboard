"use client";
/* eslint-disable @next/next/no-img-element */

import { incomedata } from "@/core/json/incomedata";
import { DatePicker } from "antd";
import Link from "next/link";
import React from "react";
import Select from "react-select";
import  Table  from "@/core/common/pagination/datatable";
import TooltipIcons from "@/core/common/tooltip-content/tooltipIcons";
import CommonFooter from "@/core/common/footer/commonFooter";

export default function IncomeReportComponent ()  {
  const data = incomedata;

  const columns = [
    {
      title: "Reference",
      dataIndex: "Reference",
      render:(text:any) => (
        <Link href="#" className="text-orange">
          {text}
        </Link>
      ),
      sorter: (a:any, b:any) => a.Reference.length - b.Reference.length,
    },
    {
      title: "Date",
      dataIndex: "Date",
      sorter: (a:any, b:any) => a.Date.length - b.Date.length,
    },

    {
      title: "Store",
      dataIndex: "Store",
      sorter: (a:any, b:any) => a.Store.length - b.Store.length,
    },

    {
      title: "Category",
      dataIndex: "Category",
      sorter: (a:any, b:any) => a.Category.length - b.Category.length,
    },
    {
      title: "Notes",
      dataIndex: "Notes",
      sorter: (a:any, b:any) => a.Notes.length - b.Notes.length,
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      sorter: (a:any, b:any) => a.Amount.length - b.Amount.length,
    },
    {
      title: "Payment Method",
      dataIndex: "Payment_Method",
      sorter: (a:any, b:any) => a.Payment_Method.length - b.Payment_Method.length,
    },
  ];


  const Store = [
    { value: "All", label: "All" },
    { value: "Electro Mart", label: "Electro Mart" },
    { value: "Quantum Gadgets", label: "Quantum Gadgets" },
    { value: "Prime Bazaar", label: "Prime Bazaar" },
  ]
  const Payment_Method = [
    { value: "All", label: "All" },
    { value: "Paypal", label: "Paypal" },
    { value: "Cash", label: "Cash" },
    { value: "Credit Card", label: "Credit Card" },
  ]

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Income Report</h4>
              <h6>View Reports of Purchases</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li className="me-2">
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh">
                <i data-feather="rotate-ccw" className="feather-rotate-ccw" />
              </a>
            </li>
            <li>
              <a
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Collapse"
                id="collapse-header"
              >
                <i data-feather="chevron-up" className="feather-chevron-up" />
              </a>
            </li>
          </ul>
        </div>
        <div className="card border-0">
          <div className="card-body pb-1">
            <form>
              <div className="row align-items-end">
                <div className="col-lg-10">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Choose Date</label>
                        <div className="input-icon-start position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            placeholder="dd/mm/yyyy"
                          />
                          <span className="input-icon-left">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Store</label>
                        <Select
                          classNamePrefix="react-select"
                          options={Store}
                          placeholder="Choose"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Payment Method</label>
                        <Select
                          classNamePrefix="react-select"
                          options={Payment_Method}
                          placeholder="Choose"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="mb-3">
                    <button className="btn btn-primary w-100" type="submit">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* /product list */}
        <div className="card table-list-card no-search">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div>
              <h4>Income Report</h4>
            </div>
            <ul className="table-top-head">
              <TooltipIcons />
              <li>
                <Link href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Print">
                  <i className="ti ti-printer" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <Table columns={columns} dataSource={data} />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      <CommonFooter />
    </div>

  );
};

