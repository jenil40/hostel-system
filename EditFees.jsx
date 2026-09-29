import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditFees = () => {
    const { id } = useParams(); // Get fee ID from URL
    const navigate = useNavigate();

    // State to hold fee details
    const [fee, setFee] = useState({
        student_name: "",
        contact_number: "",
        amount: "",
        remarks: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch existing fee details
        const fetchFeeDetails = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/fees/getById", { id });
                setFee(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch fee details");
                setLoading(false);
                toast.error("Error fetching fee details!", { position: "bottom-center", theme: "dark" });
            }
        };

        fetchFeeDetails();
    }, [id]);

    const handleChange = (e) => {
        setFee({ ...fee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/fees/update", fee);
            toast.success("Fee record updated successfully!", { position: "bottom-center", theme: "dark" });
            setTimeout(() => navigate("/view-fee"), 2000); // Redirect after success
        } catch (error) {
            toast.error("Failed to update fee record!", { position: "bottom-center", theme: "dark" });
        }
    };

    if (loading) return <p className="text-center">Loading fee details...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">Edit Fee Record</h1>
                </div>

                <div className="row">
                    <div className="col-md-12 mx-auto">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Fee Information</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Student Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="student_name"
                                            value={fee.student_name}
                                            onChange={handleChange}
                                            required
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Contact Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="contact_number"
                                            value={fee.contact_number}
                                            onChange={handleChange}
                                            required
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Amount (₹)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="amount"
                                            value={fee.amount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Remarks</label>
                                        <textarea
                                            className="form-control"
                                            name="remarks"
                                            value={fee.remarks}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-success me-2">Update Fee</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/view-fees")}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default EditFees;
