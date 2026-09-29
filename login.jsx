import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
       
    });
 
    //  Handle Input Change
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    //  Toggle Password Visibility
    const togglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    //  
    const validate = () => {
        let newErrors = {};
        if (!credentials.email.trim()) newErrors.email = "Email is required";
        if (!credentials.password.trim()) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //  Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please correct the errors before submitting!", { position: "bottom-center", theme: "dark" });
            return;
              
}
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/student/login", credentials);
            console.log('response ',response)
            if (response.status === 200) {
                toast.success("Login successful!", { position: "bottom-center", theme: "dark", autoClose: 2000 });
                
                //  Store token in localStorage
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("studentId", response.data.id);

                //  Navigate after delay
                setTimeout(() => navigate("/"), 2000);
            } else {
                toast.error("Invalid email or password!", { position: "bottom-center", theme: "dark" });
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed!", { position: "bottom-center", theme: "dark" });
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="content">
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-6 offset-3 text-center">
                        <div className="card p-5 shadow">
                            <h1 className="header-title">User Login</h1>
                            <form onSubmit={handleSubmit} className="php-email-form">
                                <div className="row gy-4 text-start">
                                    {/* Email */}
                                    <div className="col-md-12">
                                        <input type="email" name="email" className="form-control" placeholder="Your Email" onChange={handleChange} />
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>

                                    {/* Password with Show/Hide Feature */}
                                    <div className="col-md-12 position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"} // Toggle input type
                                            name="password"
                                            className="form-control"
                                            placeholder="Password"
                                            onChange={handleChange}
                                        />
                                        <span
                                            className="position-absolute top-50 end-0 translate-middle-y me-4  cursor-pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={togglePassword}
                                        >
                                            {showPassword ? "🔒" : "👁️"} {/* Show/Hide Icon */}
                                        </span>
                                        {errors.password && <small className="text-danger">{errors.password}</small>}
                                    </div>

                                    {/* Submit & Reset Buttons */}
                                    <div className="col-md-12 text-end">
                                        {loading && <div className="loading">Loading...</div>}
                                        <button type="submit" className="btn btn-primary me-3">Login</button>
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

export default Login;
