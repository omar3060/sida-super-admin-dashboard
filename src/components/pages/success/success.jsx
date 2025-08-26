import React from 'react'
import { all_routes } from '../../../Router/all_routes'
import ImageWithBasePath from '../../../core/img/imagewithbasebath';
import Link from "next/link";;

const Success = () => {

    const route = all_routes;

    return (
        <div>
            <>
                {/* Main Wrapper */}
                <div className="main-wrapper">
                    <div className="account-content">
                        <div className="login-wrapper register-wrap bg-img">
                            <div className="login-content authent-content">
                                <div className="login-userset">
                                    <div className="login-userset">
                                        <div className="login-logo logo-normal">
                                            <img src="assets/img/logo.png" alt="img" />
                                        </div>
                                    </div>
                                    <Link href={route.dashboard} className="login-logo logo-white">
                                        <img src="assets/img/logo-white.png" alt="Img" />
                                    </Link>
                                    <div className="login-userheading text-center">
                                        <img src="assets/img/icons/check-icon.svg" alt="Icon" />
                                        <h3 className="text-center">Success</h3>
                                        <h4 className="verfy-mail-content text-center">
                                            Your Passwrod Reset Successfully!
                                        </h4>
                                    </div>
                                    <div className="form-login">
                                        <Link className="btn btn-login mt-0" href={route.signin}>
                                            Back to Login
                                        </Link>
                                    </div>
                                    <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                                        <p>Copyright © 2025 DreamsPOS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Main Wrapper */}
            </>

        </div>
    )
}

export default Success
