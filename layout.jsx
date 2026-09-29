import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("studentId"); // Check if studentId exists

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem("studentId");
        navigate("/student-login"); // Redirect to login page
    };

    return (
        <>
            {/* 🔹 Header */}
            <header id="header" className="header d-flex align-items-center sticky-top">
                <div className="container-fluid container-xl position-relative d-flex align-items-center">
                    <Link to="/" className="logo d-flex align-items-center me-auto">
                        <h1 className="sitename">Hostel Management</h1>
                        <span>.</span>
                    </Link>

                    {/* 🔹 Navigation Menu */}
                    <nav id="navmenu" className="navmenu">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/apply-leave">Apply Leave</Link></li>
                            <li><Link to="/view-leave">View Leave</Link></li>
                            <li><Link to="/view-fees">View Fees</Link></li>

                            {/* Show Change Password only when logged in */}
                            {isLoggedIn && <li><Link to="/change-password">Change Password</Link></li>}

                            {/* Show Login & Register only if NOT logged in */}
                            {!isLoggedIn ? (
                                <>
                                    <li><Link to="/student-login">Login</Link></li>
                                    <li><Link to="/student-register">Register</Link></li>
                                </>
                            ) : (
                                <li>
                                    <button className="btn btn-danger ms-3" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                        <i className="mobile-nav-toggle d-xl-none bi bi-list" />
                    </nav>
                </div>
            </header>

            {/* 🔹 Page Content */}
            <main>
                <Outlet />
            </main>

            {/* 🔹 Footer */}
        </>
    );
};

export default Layout;
