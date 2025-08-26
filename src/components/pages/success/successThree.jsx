import React from 'react'
import { all_routes } from '../../../Router/all_routes'
import Link from "next/link";;
import ImageWithBasePath from '../../../core/img/imagewithbasebath';

const SuccessThree = () => {

    const route = all_routes;

    return (
        <div>
            <>
                {/* Main Wrapper */}
                <div className="main-wrapper">
                    <div className="account-content">
                        <div className="login-wrapper login-new">
                            <div className="row w-100">
                                <div className="col-lg-5 mx-auto">
                                    <div className="login-content user-login">
                                        <div className="login-logo">
                                            <img src="assets/img/logo.png" alt="img" />
                                            <Link href={route.dashboard} className="login-logo logo-white">
                                                <img src="assets/img/logo-white.png" alt="Img" />
                                            </Link>
                                        </div>
                                        <div className="card">
                                            <div className="card-body p-5">
                                                <div className="login-userheading text-center">
                                                    <img src="assets/img/icons/check-icon.svg" alt="Icon" />
                                                    <h3 className="text-center">Success</h3>
                                                    <h4 className="verfy-mail-content text-center">
                                                        Your Passwrod Reset Successfully!
                                                    </h4>
                                                </div>
                                                <div className="form-login mb-0">
                                                    <Link className="btn btn-login mt-0" href={route.signinthree}>
                                                        Back to Login
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                                <p>Copyright © 2025 DreamsPOS</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Main Wrapper */}
            </>

        </div>
    )
}

export default SuccessThree
