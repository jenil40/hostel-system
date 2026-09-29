import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFees = () => {
    const { feeId } = useParams();
    const navigate = useNavigate();

    const [fee, setFee] = useState({
        student_id: "",
        amount: "",
        remarks: "",
    });

    const [students, setStudents] = useState([]);
    const [errors, setErrors] = useState({}); // Validation Errors

    // Fetch students list
    useEffect(() => {
        axios.post("http://localhost:5000/api/student/getAll")
            .then((response) => {
                setStudents(response.data);
            })
            .catch(() => {
                toast.error("Failed to load students", {
                    position: "bottom-center",
                    theme: "dark",
                    style: { backgroundColor: "#dc3545", color: "#fff" },
                });
            });
    }, []);

    // Fetch fee details if editing
    useEffect(() => {
        if (feeId) {
            axios.post("http://localhost:5000/api/fees/getById", { id: feeId })
                .then((response) => {
                    setFee(response.data);
                })
                .catch(() => {
                    toast.error("Failed to load fee details", {
                        position: "bottom-center",
                        theme: "dark",
                        style: { backgroundColor: "#dc3545", color: "#fff" },
                    });
                });
        }
    }, [feeId]);

    // Validate Form
    const validate = () => {
        let tempErrors = {};

        if (!fee.student_id) tempErrors.student_id = "Student selection is required.";
        if (!fee.amount) tempErrors.amount = "Amount is required.";
        if (!fee.remarks) tempErrors.remarks = "Remarks are required.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFee({ ...fee, [e.target.name]: e.target.value });

        // Remove validation error once field is filled
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fill all required fields.", {
                position: "bottom-center",
                theme: "dark",
                style: { backgroundColor: "#dc3545", color: "#fff" },
            });
            return;
        }

        try {
            const endpoint = feeId ? "update" : "insert";
            const response = await axios.post(`http://localhost:5000/api/fees/${endpoint}`, { id: feeId, ...fee });

            if (response.status === 200) {
                toast.success(`Fee ${feeId ? "updated" : "added"} successfully!`, {
                    position: "bottom-center",
                    theme: "dark",
                    style: { backgroundColor: "#28a745", color: "#fff" },
                });

                setTimeout(() => {
                    navigate("/view-fee");
                }, 2000);
            } else {
                toast.error("Failed to save fee record. Try again!", {
                    position: "bottom-center",
                    theme: "dark",
                    style: { backgroundColor: "#dc3545", color: "#fff" },
                });
            }
        } catch (error) {
            toast.error("Error saving fee record!", {
                position: "bottom-center",
                theme: "dark",
                style: { backgroundColor: "#dc3545", color: "#fff" },
            });
            console.error("Error:", error);
        }
    };

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">{feeId ? "Edit Fee" : "Add Fee"}</h1>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Student</label>
                                        <select
                                            name="student_id"
                                            className={`form-control ${errors.student_id ? "is-invalid" : ""}`}
                                            value={fee.student_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Student</option>
                                            {students.map((student) => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name} - {student.contact_number}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.student_id && <div className="invalid-feedback">{errors.student_id}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Amount</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                                            value={fee.amount}
                                            onChange={handleChange}
                                            placeholder="fees amount goes here"
                                        />
                                        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Remarks</label>
                                        <textarea
                                            name="remarks"
                                            className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
                                            value={fee.remarks}
                                            onChange={handleChange}
                                            placeholder="add remarks here"
                                        ></textarea>
                                        {errors.remarks && <div className="invalid-feedback">{errors.remarks}</div>}
                                    </div>

                                    <div align="right">
                                        <button type="submit" className="btn btn-primary me-2">
                                            {feeId ? "Update Fee" : "Add Fee"}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/view-fees")}>
                                            Back
                                        </button>
                                    </div>
                                </form>
                                <ToastContainer autoClose={3000} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AddFees;
