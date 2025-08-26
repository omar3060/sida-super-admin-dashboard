"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import Select from "react-select";
import  Table  from "@/core/common/pagination/datatable";
import { supplierduereportdata } from "@/core/json/supplierduereportdata";
import Link from "next/link";
import { all_routes } from "@/data/all_routes";
import RefreshIcon from "@/core/common/tooltip-content/refresh";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import { DatePicker } from "antd";
import TooltipIcons from "@/core/common/tooltip-content/tooltipIcons";
import CommonFooter from "@/core/common/footer/commonFooter";

export default function  SupplierDueReportComponent  () {
  const data = supplierduereportdata;

  const statusOptions = [
    { value: "chooseStatus", label: "Choose Status" },
    { value: "received", label: "Received" },
    { value: "Pending", label: "Pending" },
    { value: "Ordered", label: "Ordered" },
  ];

  const supplierNameOptions = [
    { value: "chooseSupplierName", label: "Choose Supplier Name" },
    { value: "apexComputers", label: "Apex Computers" },
    { value: "beatsHeadphones", label: "Beats Headphones" },
  ];

  const paymentmethode = [
    { value: "Cash", label: "Cash" },
    { value: "Paypal", label: "Paypal" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Stripe", label: "Stripe" },
  ];

  const columns = [
    {
      title: "Reference",
      dataIndex: "Reference",
      render: (text:any) => (
        <>
          <Link href="#" className="text-primary">{text}</Link>
        </>
      ),
      sorter: (a:any, b:any) => a.Reference.length - b.Reference.length,
    },
    {
      title: "ID",
      dataIndex: "ID",
      sorter: (a:any, b:any) => a.ID.length - b.ID.length,
    },

    {
      title: "Supplier",
      dataIndex: "Supplier",
      render: (text:any, record:any) => (
        <>
          <div className="d-flex align-items-center">
            <Link href="#" className="avatar avatar-md me-2">
              <img src={record.image} alt="Img" />
            </Link>
            <h6 className="fw-medium">
              <Link href="#">{text}</Link>
            </h6>
          </div>

        </>
      ),
      sorter: (a:any, b:any) => a.Supplier.length - b.Supplier.length,
    },

    {
      title: "Total Items",
      dataIndex: "Total_Items",
      sorter: (a:any, b:any) => a.Total_Items.length - b.Total_Items.length,
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
    {
      title: "Status",
      dataIndex: "Status",
      render: (text:any) => (
        <span className={`badge  ${text === 'Paid' ? 'badge-success' : text === 'Overdue' ? 'badge-purple' : 'badge-danger'} d-inline-flex align-items-center badge-xs`}>
          {text}
        </span>
      ),
      sorter: (a:any, b:any) => a.Status.length - b.Status.length,
    },

  ];

  const route = all_routes;

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="table-tab">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <Link className="nav-link " href={route.supplierreport}>
                Supplier Report
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" href={route.supplierduereport}>
                Supplier Due
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Supplier Due</h4>
                <h6>View Reports of Supplier Due</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <RefreshIcon />
              <CollapesIcon />
            </ul>
          </div>
          <div className="card border-0">
            <div className="card-body pb-1">
              <form>
                <div className="row align-items-end">
                  <div className="col-lg-10">
                    <div className="row">
                      <div className="col-md-3">
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
                      <div className="col-md-3">
                        <div className="mb-3">
                          <label className="form-label">Supplier</label>
                          <Select
                            classNamePrefix="react-select"
                            options={supplierNameOptions}
                            placeholder="Choose"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <Select
                            classNamePrefix="react-select"
                            options={statusOptions}
                            placeholder="Choose"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3">
                          <label className="form-label">Payment Method</label>
                          <Select
                            classNamePrefix="react-select"
                            options={paymentmethode}
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
            <div className="card-body">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                <div>
                  <h4>Supplier Report</h4>
                </div>
                <ul className="table-top-head">
                  <TooltipIcons />
                  <li>
                    <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print">
                      <i className="ti ti-printer" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="table-responsive custome-search">
              <Table columns={columns} dataSource={data} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>

      </div>
      <CommonFooter />
    </div>
  );
};

