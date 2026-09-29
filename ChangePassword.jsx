import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false,
    });

    const [passwords, setPasswords] = useState({
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    //  Handle Input Change
    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    //  Toggle Password Visibility
    const togglePassword = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    //  Validation Function
    const validate = () => {
        let newErrors = {};

        if (!passwords.email.trim()) newErrors.email = "Email is required";
        if (!passwords.currentPassword.trim()) newErrors.currentPassword = "Current password is required";
        if (!passwords.newPassword.trim() || passwords.newPassword.length < 6)
            newErrors.newPassword = "New password must be at least 6 characters";
        if (passwords.newPassword !== passwords.confirmNewPassword)
            newErrors.confirmNewPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please correct the errors before submitting!", { position: "bottom-center", theme: "dark" });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/student/change-password", passwords);

            if (response.status === 200) {
                toast.success("Password changed successfully!", { position: "bottom-center", theme: "dark", autoClose: 2000 });
                setTimeout(() => navigate("/student-login"), 2000);
            } else {
                toast.error("Failed to change password. Try again!", { position: "bottom-center", theme: "dark" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error changing password!", { position: "bottom-center", theme: "dark" });
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="content">
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="card p-5 shadow">
                            <h1 className="header-title mb-4">Change Password</h1>
                            <form onSubmit={handleSubmit} className="php-email-form">
                                <div className="row gy-4 text-start">
                                    {/* Email */}
                                    <div className="col-md-6">
                                        <input type="email" name="email" className="form-control" placeholder="Your Email" onChange={handleChange} />
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>

                                    {/* Current Password */}
                                    <div className="col-md-6 position-relative">
                                        <input
                                            type={showPassword.currentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            className="form-control"
                                            placeholder="Current Password"
                                            onChange={handleChange}
                                        />
                                        <span
                                            className="position-absolute top-50 end-0 translate-middle-y me-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => togglePassword("currentPassword")}
                                        >
                                            {showPassword.currentPassword ? "🔒" : "👁️"}
                                        </span>
                                        {errors.currentPassword && <small className="text-danger">{errors.currentPassword}</small>}
                                    </div>

                                    {/* New Password */}
                                    <div className="col-md-6 position-relative">
                                        <input
                                            type={showPassword.newPassword ? "text" : "password"}
                                            name="newPassword"
                                            className="form-control"
                                            placeholder="New Password"
                                            onChange={handleChange}
                                        />
                                        <span
                                            className="position-absolute top-50 end-0 translate-middle-y me-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => togglePassword("newPassword")}
                                        >
                                            {showPassword.newPassword ? "🔒" : "👁️"}
                                        </span>
                                        {errors.newPassword && <small className="text-danger">{errors.newPassword}</small>}
                                    </div>

                                    {/* Confirm New Password */}
                                    <div className="col-md-6 position-relative">
                                        <input
                                            type={showPassword.confirmNewPassword ? "text" : "password"}
                                            name="confirmNewPassword"
                                            className="form-control"
                                            placeholder="Confirm New Password"
                                            onChange={handleChange}
                                        />
                                        <span
                                            className="position-absolute top-50 end-0 translate-middle-y me-4 cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => togglePassword("confirmNewPassword")}
                                        >
                                            {showPassword.confirmNewPassword ? "🔒" : "👁️"}
                                        </span>
                                        {errors.confirmNewPassword && <small className="text-danger">{errors.confirmNewPassword}</small>}
                                    </div>

                                    {/* Submit & Reset Buttons */}
                                    <div className="col-md-12 text-end">
                                        {loading && <div className="loading">Loading...</div>}
                                        <button type="submit" className="btn btn-primary me-3">Change Password</button>
                                        <button type="reset" className="btn btn-danger">Clear</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default ChangePassword;
