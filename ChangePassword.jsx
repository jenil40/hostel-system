import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    }); //  Toggle password visibility
    const navigate = useNavigate();

    const validateInputs = () => {
        let tempErrors = {};
        let isValid = true;

        if (!currentPassword.trim()) {
            tempErrors.currentPassword = "Current password is required!";
            isValid = false;
        }

        if (!newPassword.trim()) {
            tempErrors.newPassword = "New password is required!";
            isValid = false;
        } else if (newPassword.length < 6) {
            tempErrors.newPassword = "Password must be at least 6 characters long!";
            isValid = false;
        } else if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            tempErrors.newPassword = "Password must contain an uppercase letter and a number!";
            isValid = false;
        }

        if (!confirmPassword.trim()) {
            tempErrors.confirmPassword = "Confirm password is required!";
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match!";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            toast.error("Please fix the errors before proceeding!", { autoClose: 2000 });
            return;
        }

        setLoading(true);
        const email = localStorage.getItem("email");
        const userType = "admin";

        // if (!email || !userType) {
        //     toast.error("User not logged in", { autoClose: 2000 });
        //     navigate("/admin-login");
        //     return;
        // }

        try {
            await axios.post("http://localhost:5000/api/admin/change-password", {
                userType,
                email,
                currentPassword,
                newPassword,
            });

            toast.success("Password changed successfully! Logging out...", { autoClose: 2000 });

            // Clear localStorage (forcing logout)
            setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userType");
                localStorage.removeItem("email");
                navigate("/admin-login");
            }, 2500);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: "10%" }}>
            <ToastContainer position="bottom-center" />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-center">Change Password</h3>
                            <form onSubmit={handleChangePassword}>
                                {/* Current Password */}
                                <div className="mb-3 position-relative">
                                    <label>Current Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword.current ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Enter current password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowPassword((prev) => ({ ...prev, current: !prev.current }))
                                            }
                                        >
                                            <i className={`bi ${showPassword.current ? "bi-eye-slash" : "bi-eye"}`}></i>
                                        </button>
                                    </div>
                                    {errors.currentPassword && (
                                        <small className="text-danger">{errors.currentPassword}</small>
                                    )}
                                </div>

                                {/* New Password */}
                                <div className="mb-3 position-relative">
                                    <label>New Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword.new ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                                            }
                                        >
                                            <i className={`bi ${showPassword.new ? "bi-eye-slash" : "bi-eye"}`}></i>
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <small className="text-danger">{errors.newPassword}</small>
                                    )}
                                    <small className="text-muted">
                                        Password must be at least 6 characters, contain an uppercase letter and a number.
                                    </small>
                                </div>

                                {/* Confirm New Password */}
                                <div className="mb-3 position-relative">
                                    <label>Confirm New Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword.confirm ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                                            }
                                        >
                                            <i className={`bi ${showPassword.confirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <small className="text-danger">{errors.confirmPassword}</small>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Updating..." : "Change Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
