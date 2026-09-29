import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const AdminLogin = () => {
    const [userType, setUserType] = useState("admin"); // Default to admin
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); //  Toggle password visibility
    const navigate = useNavigate();

    //  Form Validation
    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!email.trim()) {
            tempErrors.email = "Email is required!";
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            tempErrors.email = "Invalid email format!";
            isValid = false;
        }

        if (!password.trim()) {
            tempErrors.password = "Password is required!";
            isValid = false;
        } else if (password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters!";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before proceeding!", { autoClose: 2000 });
            return;
        }

        setLoading(true);

        try {
            const endpoint = userType === "admin" ? "/api/admin/login" : "/api/student/login";
            const response = await axios.post(`http://localhost:5000${endpoint}`, { email, password });

            toast.success(`${userType} login successful! Redirecting...`, { autoClose: 2000 });

            // Store token and user type in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userType", userType);
            localStorage.setItem("email", email);

            // Redirect based on user type after delay
            setTimeout(() => {
                navigate(userType === "admin" ? "/" : "/student-dashboard");
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main h-100 w-100" style={{ paddingTop: "10%" }}>
            <ToastContainer position="bottom-center" />
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">
                            <div className="text-center mt-4">
                                <h1 className="h2">Welcome to Hostel Management</h1>
                                <p className="lead">Sign in to your account to continue</p>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="m-sm-4">
                                        <form onSubmit={handleLogin}>
                                            {/* User Type Selection */}
                                            <div className="mb-3">
                                                <label>User Type</label>
                                                <select
                                                    className="form-control form-control-lg"
                                                    value={userType}
                                                    onChange={(e) => setUserType(e.target.value)}
                                                >
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>

                                            {/* Email Input */}
                                            <div className="mb-3">
                                                <label>Email</label>
                                                <input
                                                    className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>

                                            {/* Password Input with Eye Icon */}
                                            <div className="mb-3 position-relative">
                                                <label>Password</label>
                                                <div className="input-group">
                                                    <input
                                                        className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                                    </button>
                                                </div>
                                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                            </div>

                                            {/* Submit Button */}
                                            <div className="text-center mt-3">
                                                <button type="submit" className="btn btn-lg btn-primary" disabled={loading}>
                                                    {loading ? "Signing in..." : "Sign in"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminLogin;
