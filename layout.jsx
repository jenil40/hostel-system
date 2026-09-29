import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
    const navigate = useNavigate();

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        localStorage.removeItem("userType"); // Remove user type
        navigate("/admin-login"); // Redirect to login page
    };

    return (
        <>
            {/* <div className="splash active">
                <div className="splash-icon" />
            </div> */}
            <div className="wrapper">
                <nav id="sidebar" className="sidebar">
                    <Link className="sidebar-brand" to="/">
                        Hostel Management
                    </Link>
                    <div className="sidebar-content">
                        <ul className="sidebar-nav mt-3">
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">Home</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/add-room">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">Add Room</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/view-room">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">View Room</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/add-asset">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">Add Assets</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/view-assets">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">View Assets</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/add-fee">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">Add Fees</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/view-fee">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">View Fees</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/view-students">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">View Students</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/student-leave">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">View Student Leave</span>
                                </Link>
                            </li>
                            <li className="sidebar-item">
                                <Link className="sidebar-link" to="/change-password">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">Change password</span>
                                </Link>
                            </li>
                            {/* Logout Button */}
                            <li className="sidebar-item">
                                <a onClick={handleLogout} className="sidebar-link" to="/student-leave">
                                    <i className="align-middle me-2 fas fa-fw fa-list" />
                                    <span className="align-middle">Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="main">
                    <nav className="navbar navbar-expand navbar-theme mt-4">
                        <a className="sidebar-toggle d-flex me-2">
                            <i className="hamburger align-self-center" />
                        </a>
                    </nav>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Layout;
