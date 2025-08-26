"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import Select from "react-select";
import { DatePicker } from "antd";
import { salesreportdata } from "@/core/json/salesreportdata";
import Link from "next/link";
import RefreshIcon from "@/core/common/tooltip-content/refresh";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import  Table  from "@/core/common/pagination/datatable";
import { ProductName, Store } from "@/core/common/selectOption/selectOption";
import TooltipIcons from "@/core/common/tooltip-content/tooltipIcons";
import CommonFooter from "@/core/common/footer/commonFooter";


export default function SalesReportComponent() {


  const data = salesreportdata;
  const [searchText] = useState("");

  const filteredData = data.filter((entry:any) => {
    return Object.keys(entry).some((key:any) => {
      return String(entry[key])
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  });



  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text:any, record:any) => (
        <span className="productimgname">
          <Link href="#" className="product-img stock-img">
            <img alt="" src={record.img} />
          </Link>
          <Link href="#">{text}</Link>
        </span>
      ),
      sorter: (a:any, b:any) => a.productName.length - b.productName.length,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a:any, b:any) => a.sku.length - b.sku.length,
    },

    {
      title: "Category",
      dataIndex: "category",
      sorter: (a:any, b:any) => a.category.length - b.category.length,
    },

    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a:any, b:any) => a.brand.length - b.brand.length,
    },
    {
      title: "Sold Qty",
      dataIndex: "soldQty",
      sorter: (a:any, b:any) => a.soldQty.length - b.soldQty.length,
    },
    {
      title: "Sold Amount",
      dataIndex: "soldAmount",
      sorter: (a:any, b:any) => a.soldAmount.length - b.soldAmount.length,
    },
    {
      title: "Instock Qty",
      dataIndex: "instockQty",
      sorter: (a:any, b:any) => a.instockQty.length - b.instockQty.length,
    },

  ];
  return (
    <div className="page-wrapper">
      <div className="content">

        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Sales Report</h4>
              <h6>Manage your Sales report</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <RefreshIcon />
            <CollapesIcon />
          </ul>
        </div>
        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card border border-success sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-success text-white">
                  <i className="ti ti-align-box-bottom-left-filled fs-24" />
                </span>
                <div className="ms-2">
                  <p className="fw-medium mb-1">Total Amount</p>
                  <div>
                    <h3>$4,56,000</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card border border-info sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-info text-white">
                  <i className="ti ti-align-box-bottom-left-filled fs-24" />
                </span>
                <div className="ms-2">
                  <p className="fw-medium mb-1">Total Paid</p>
                  <div>
                    <h3>$2,56,42</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card border border-orange sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-orange text-white">
                  <i className="ti ti-moneybag fs-24" />
                </span>
                <div className="ms-2">
                  <p className="fw-medium mb-1">Total Unpaid</p>
                  <div>
                    <h3>$1,52,45</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card border border-danger sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-danger text-white">
                  <i className="ti ti-alert-circle-filled fs-24" />
                </span>
                <div className="ms-2">
                  <p className="fw-medium mb-1">Overdue</p>
                  <div>
                    <h3>$2,56,12</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card border-0">
          <div className="card-body pb-1">
            <form >
              <div className="row align-items-end">
                <div className="col-lg-10">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Choose Date&nbsp;</label>
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
                        <label className="form-label">Products</label>
                        <Select
                          classNamePrefix="react-select"
                          options={ProductName}
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
        <div className="card table-list-card hide-search">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div>
              <h4>Sales Report</h4>
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
              <Table columns={columns} dataSource={filteredData} />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      <CommonFooter />
    </div>
  );
};
