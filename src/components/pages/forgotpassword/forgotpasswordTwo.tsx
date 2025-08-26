"use client";
/* eslint-disable @next/next/no-img-element */

import { all_routes } from "@/data/all_routes";
import Link from "next/link";
import React from "react";

export default function ForgotpasswordTwoComponent() {
  const route = all_routes;
  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="account-content">
          <div className="row login-wrapper m-0">
            <div className="col-lg-6 p-0">
              <div className="login-content">
                <form >
                  <div className="login-userset">
                    <div className="login-logo logo-normal">
                      <img src="assets/img/logo.png" alt="img" />
                    </div>
                    <Link href={route.dashboard} className="login-logo logo-white">
                      <img src="assets/img/logo-white.png" alt="Img" />
                    </Link>
                    <div className="login-userheading">
                      <h3>Forgot password?</h3>
                      <h4>
                        If you forgot your password, well, then we’ll email you
                        instructions to reset your password.
                      </h4>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Email <span className="text-danger"> *</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          defaultValue=""
                          className="form-control border-end-0"
                        />
                        <span className="input-group-text border-start-0">
                          <i className="ti ti-mail" />
                        </span>
                      </div>
                    </div>
                    <div className="form-login">
                      <Link href={route.signintwo} className="btn btn-login">
                        Sign Up
                      </Link>
                    </div>
                    <div className="signinform text-center">
                      <h4>
                        Return to
                        <Link href={route.signintwo} className="hover-a">
                          {" "}
                          login{" "}
                        </Link>
                      </h4>
                    </div>
                    <div className="form-setlogin or-text">
                      <h4>OR</h4>
                    </div>
                    <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                      <p>Copyright © 2025 DreamsPOS</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <div className="login-img">
                <img
                  src="assets/img/authentication/authentication-03.svg"
                  alt="img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>

  );
};


