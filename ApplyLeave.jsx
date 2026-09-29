import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ApplyLeave = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [leaveDetails, setLeaveDetails] = useState({
        student_id: "",
        start_date: "",
        end_date: "",
        reason: "",
    });
    const navigate = useNavigate();
    //  Get student_id from localStorage on component mount
    useEffect(() => {
        const storedStudentId = localStorage.getItem("studentId");
        if (storedStudentId) {
            setLeaveDetails((prev) => ({ ...prev, student_id: storedStudentId }));
        } else {
            toast.error("Student ID not found. Please login again!", { position: "bottom-center", theme: "dark" });
            navigate("/student-login")
        }
    }, []);

    //  Handle Input Change
    const handleChange = (e) => {
        setLeaveDetails({ ...leaveDetails, [e.target.name]: e.target.value });
    };

    //  Validation Function
    const validate = () => {
        let newErrors = {};
        if (!leaveDetails.start_date) newErrors.start_date = "Start date is required";
        if (!leaveDetails.end_date) newErrors.end_date = "End date is required";
        if (new Date(leaveDetails.start_date) > new Date(leaveDetails.end_date))
            newErrors.end_date = "End date must be after start date";
        if (!leaveDetails.reason.trim()) newErrors.reason = "Reason is required";

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
            const response = await axios.post("http://localhost:5000/api/student/apply-leave", {
                ...leaveDetails,
                status: 0, // Default status is 'pending' (0)
            });

            if (response.status === 200) {
                toast.success("Leave application submitted successfully!", { position: "bottom-center", theme: "dark", autoClose: 2000 });
                setLeaveDetails({ student_id: leaveDetails.student_id, start_date: "", end_date: "", reason: "" });
                navigate("/view-leave")
            } else {
                toast.error("Failed to apply for leave. Try again!", { position: "bottom-center", theme: "dark" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error applying for leave!", { position: "bottom-center", theme: "dark" });
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
                            <h1 className="header-title mb-4">Apply for Leave</h1>
                            <form onSubmit={handleSubmit} className="php-email-form">
                                <div className="row gy-4 text-start">
                                    {/* Start Date */}
                                    <div className="col-md-6">
                                        <label>Start Date</label>
                                        <input type="date" name="start_date" className="form-control" onChange={handleChange} value={leaveDetails.start_date} />
                                        {errors.start_date && <small className="text-danger">{errors.start_date}</small>}
                                    </div>

                                    {/* End Date */}
                                    <div className="col-md-6">
                                        <label>End Date</label>
                                        <input type="date" name="end_date" className="form-control" onChange={handleChange} value={leaveDetails.end_date} />
                                        {errors.end_date && <small className="text-danger">{errors.end_date}</small>}
                                    </div>

                                    {/* Reason */}
                                    <div className="col-md-12">
                                        <label>Reason</label>
                                        <textarea name="reason" className="form-control" rows="3" placeholder="Explain your reason..." onChange={handleChange} value={leaveDetails.reason}></textarea>
                                        {errors.reason && <small className="text-danger">{errors.reason}</small>}
                                    </div>

                                    {/* Submit & Reset Buttons */}
                                    <div className="col-md-12 text-end">
                                        {loading && <div className="loading">Loading...</div>}
                                        <button type="submit" className="btn btn-primary me-3">Apply Leave</button>
                                        <button type="reset" className="btn btn-danger" onClick={() => setLeaveDetails({ student_id: leaveDetails.student_id, start_date: "", end_date: "", reason: "" })}>Clear</button>
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

export default ApplyLeave;
