"use client";
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import  Table  from "@/core/common/pagination/datatable";
import { DatePicker } from 'antd';
import Select from "react-select";
import { all_routes } from '@/data/all_routes';
import { Stockhistroydata } from '@/core/json/stockhistorydata';
import Link from 'next/link';
import RefreshIcon from '@/core/common/tooltip-content/refresh';
import CollapesIcon from '@/core/common/tooltip-content/collapes';
import { Category, ProductName } from '@/core/common/selectOption/selectOption';
import TooltipIcons from '@/core/common/tooltip-content/tooltipIcons';
import CommonFooter from '@/core/common/footer/commonFooter';

export default function StockhistoryComponent (){

    const route = all_routes;

    const data = Stockhistroydata;

    const columns = [
        {
            title: "SKU",
            dataIndex: "SKU",
            sorter: (a:any, b:any) => a.SKU.length - b.SKU.length,
        },
        {
            title: "Product Name",
            dataIndex: "Product_Name",
            render: (text:any, record:any) => (
                <div className="d-flex align-items-center">
                    <Link className="avatar avatar-md" href="#">
                        <img
                            src={record.img}
                            className="img-fluid"
                            alt="img"
                        />
                    </Link>
                    <div className="ms-2">
                        <p className="text-dark mb-0">
                            {text}
                            {text}
                        </p>
                    </div>
                </div>

            ),
            sorter: (a:any, b:any) => a.Product_Name.length - b.Product_Name.length,
        },


        {
            title: "Initial Quantity",
            dataIndex: "Initial_Quantity",
            sorter: (a:any, b:any) => a.Initial_Quantity.length - b.Initial_Quantity.length,
        },

        {
            title: "Added Quantity",
            dataIndex: "Added_Quantity",
            sorter: (a:any, b:any) => a.Added_Quantity.length - b.Added_Quantity.length,
        },
        {
            title: "Sold Quantity",
            dataIndex: "Sold_Quantity",
            sorter: (a:any, b:any) => a.Sold_Quantity.length - b.Sold_Quantity.length,
        },

        {
            title: "Defective Quantity",
            dataIndex: "Defective_Quantity",
            sorter: (a:any, b:any) => a.Defective_Quantity.length - b.Defective_Quantity.length,
        },
        {
            title: "Final Quantity",
            dataIndex: "Final_Quantity",
            sorter: (a:any, b:any) => a.Final_Quantity.length - b.Final_Quantity.length,
        },

    ];

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="table-tab">
                        <ul className="nav nav-pills">
                            <li className="nav-item">
                                <Link className="nav-link" href={route.inventoryreport}>
                                    Inventory Report
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" href={route.stockhistory}>
                                    Stock History
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href={route.soldstock}>
                                    Sold Stock
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="page-header">
                            <div className="add-item d-flex">
                                <div className="page-title">
                                    <h4>Stock History</h4>
                                    <h6>View Reports of Stock History</h6>
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
                                                        <label className="form-label">Category</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={Category}
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
                        <div className="card table-list-card no-search">
                            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                <div>
                                    <h4>Customer Report</h4>
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
                </div>
                <CommonFooter />
            </div>

        </div>
    )
}

