"use client";
/* eslint-disable @next/next/no-img-element */

import CollapesIcon from '@/core/common/tooltip-content/collapes';
import RefreshIcon from '@/core/common/tooltip-content/refresh';
import { BestSellerData } from '@/core/json/bestsellerdata';
import Link from 'next/link';
import  Table  from "@/core/common/pagination/datatable";
import React from 'react'
import Select from "react-select";
import { DatePicker } from 'antd';
import { BestStores, Products } from '@/core/common/selectOption/selectOption';
import TooltipIcons from '@/core/common/tooltip-content/tooltipIcons';
import CommonFooter from '@/core/common/footer/commonFooter';

export default function BestSellerComponent () {


    const data = BestSellerData;

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
            title: "Category",
            dataIndex: "Category",
            sorter: (a:any, b:any) => a.Category.length - b.Category.length,
        },

        {
            title: "Brand",
            dataIndex: "Brand",
            sorter: (a:any, b:any) => a.Brand.length - b.Brand.length,
        },
        {
            title: "Sold Qty",
            dataIndex: "Sold_Qty",
            sorter: (a:any, b:any) => a.Sold_Qty.length - b.Sold_Qty.length,
        },

        {
            title: "Sold Amount",
            dataIndex: "Sold_Amount",
            sorter: (a:any, b:any) => a.Sold_Amount.length - b.Sold_Amount.length,
        },
        {
            title: "Instock Qty",
            dataIndex: "Instock_Qty",
            sorter: (a:any, b:any) => a.Instock_Qty.length - b.Instock_Qty.length,
        },
    ];

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="table-tab"></div>
                    <div>
                        <div className="page-header">
                            <div className="add-item d-flex">
                                <div className="page-title">
                                    <h4>Bestseller Products Report</h4>
                                    <h6>View Reports of Best Selling Products</h6>
                                </div>
                            </div>
                            <ul className="table-top-head">
                                <RefreshIcon />
                                <CollapesIcon />
                            </ul>
                        </div>
                        <div className="card border-0">
                            <div className="card-body pb-1">
                                <form >
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
                                                            options={BestStores}
                                                            placeholder="Choose"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label">Products</label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            options={Products}
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
                                <div className='common-search-icon'>
                                    <h4>Best Sellers</h4>
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
                                    <div className="table-responsive">
                                        <Table columns={columns} dataSource={data} />
                                    </div>
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

