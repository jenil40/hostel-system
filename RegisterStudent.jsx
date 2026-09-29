import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterStudent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [student, setStudent] = useState({
        name: "",
        contact_number: "",
        email: "",
        password: "",
        emergency_number: "",
        roomid: "",
        dob: "",
        gender: "",
        caste: "",
        medical_condition: "",
        photo: null,
    });

    //  Handle Input Change
    const handleChange = (e) => {
        if (e.target.name === "photo") {
            setStudent({ ...student, photo: e.target.files[0] });
        } else {
            setStudent({ ...student, [e.target.name]: e.target.value });
        }
    };

    //  Validation Function
    const validate = () => {
        let newErrors = {};

        if (!student.name.trim()) newErrors.name = "Name is required";
        if (!student.email.trim()) newErrors.email = "Email is required";
        if (!student.password || student.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (!student.contact_number.match(/^\d{10}$/))
            newErrors.contact_number = "Contact number must be 10 digits";
        if (!student.emergency_number.match(/^\d{10}$/))
            newErrors.emergency_number = "Emergency number must be 10 digits";
        if (!student.roomid.trim()) newErrors.roomid = "Room ID is required";
        if (!student.dob.trim()) newErrors.dob = "Date of Birth is required";
        if (student.gender === "") newErrors.gender = "Gender is required";
        if (!student.caste.trim()) newErrors.caste = "Caste is required";
        if (!student.medical_condition.trim())
            newErrors.medical_condition = "Medical condition is required";
        if (!student.photo) newErrors.photo = "Photo is required";

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
        const formData = new FormData();
        Object.keys(student).forEach((key) => {
            formData.append(key, student[key]);
        });

        try {
            const response = await axios.post("http://localhost:5000/api/student/insert", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast.success("Registration successful!", { position: "bottom-center", theme: "dark", autoClose: 2000 });
                setTimeout(() => navigate("/"), 2000);
            } else {
                toast.error("Failed to register. Try again!", { position: "bottom-center", theme: "dark" });
            }
        } catch (error) {
            toast.error("Error during registration!", { position: "bottom-center", theme: "dark" });
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="content">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="card p-5 shadow">
                            <h1 className="header-title">Student Registration</h1>
                            <form onSubmit={handleSubmit} className="php-email-form">
                                <div className="row gy-4 text-start">
                                    {/* Name */}
                                    <div className="col-md-6">
                                        <input type="text" name="name" className="form-control" placeholder="Your Name" onChange={handleChange} />
                                        {errors.name && <small className="text-danger">{errors.name}</small>}
                                    </div>

                                    {/* Email */}
                                    <div className="col-md-6">
                                        <input type="email" name="email" className="form-control" placeholder="Your Email" onChange={handleChange} />
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>

                                    {/* Password */}
                                    <div className="col-md-6">
                                        <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} />
                                        {errors.password && <small className="text-danger">{errors.password}</small>}
                                    </div>

                                    {/* Contact Number */}
                                    <div className="col-md-6">
                                        <input type="text" name="contact_number" className="form-control" placeholder="Contact Number" onChange={handleChange} />
                                        {errors.contact_number && <small className="text-danger">{errors.contact_number}</small>}
                                    </div>

                                    {/* Emergency Number */}
                                    <div className="col-md-6">
                                        <input type="text" name="emergency_number" className="form-control" placeholder="Emergency Number" onChange={handleChange} />
                                        {errors.emergency_number && <small className="text-danger">{errors.emergency_number}</small>}
                                    </div>

                                    {/* DOB */}
                                    <div className="col-md-6">
                                        <input type="date" name="dob" className="form-control" onChange={handleChange} />
                                        {errors.dob && <small className="text-danger">{errors.dob}</small>}
                                    </div>

                                    {/* Gender */}
                                    <div className="col-md-6">
                                        <select name="gender" className="form-control" onChange={handleChange}>
                                            <option value="">Select Gender</option>
                                            <option value="1">Male</option>
                                            <option value="0">Female</option>
                                        </select>
                                        {errors.gender && <small className="text-danger">{errors.gender}</small>}
                                    </div>

                                    {/* Caste */}
                                    <div className="col-md-6">
                                        <input type="text" name="caste" className="form-control" placeholder="Caste" onChange={handleChange} />
                                        {errors.caste && <small className="text-danger">{errors.caste}</small>}
                                    </div>

                                    {/* Room ID */}
                                    <div className="col-md-6">
                                        <input type="number" name="roomid" className="form-control" placeholder="Room ID" onChange={handleChange} />
                                        {errors.roomid && <small className="text-danger">{errors.roomid}</small>}
                                    </div>

                                    {/* Medical Condition */}
                                    <div className="col-md-6">
                                        <input type="text" name="medical_condition" className="form-control" placeholder="Medical Condition" onChange={handleChange} />
                                        {errors.medical_condition && <small className="text-danger">{errors.medical_condition}</small>}
                                    </div>

                                    {/* Photo */}
                                    <div className="col-md-6">
                                        <input type="file" name="photo" className="form-control" onChange={handleChange} />
                                        {errors.photo && <small className="text-danger">{errors.photo}</small>}
                                    </div>

                                    {/* Submit & Reset Buttons */}
                                    <div className="col-md-12 text-end">
                                        {loading && <div className="loading">Loading...</div>}
                                        <button type="submit" className="btn btn-primary me-3">Register</button>
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

export default RegisterStudent;