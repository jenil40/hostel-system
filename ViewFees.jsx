import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewFees = () => {
    const [fees, setFees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const studentId = localStorage.getItem("studentId");

    useEffect(() => {
        if (!studentId) {
            toast.error("Student ID not found. Please login again!", { position: "bottom-center", theme: "dark" });
            return;
        }
        fetchFees();
    }, []);

    // Fetch Student Fees Data
    const fetchFees = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/fees/getFee/${studentId}`);
            setFees(response.data);
        } catch (error) {
            toast.error("Error fetching fees data!", { position: "bottom-center", theme: "dark" });
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    //  Format Date in DD-MM-YYYY (Indian Format)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    //  Filter Fees based on Search
    const filteredFees = fees.filter((fee) =>
        fee.amount.toString().includes(search) ||
        formatDate(fee.due_date).includes(search) ||
        (fee.status === 0 ? "Pending" : "Paid").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="content">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="card p-5 shadow">
                            <h1 className="header-title mb-4">Your Fee Records</h1>
                            {/* Search Bar */}
                            <div className="mb-3 text-end">
                                <input
                                    type="text"
                                    className="form-control w-50 d-inline"
                                    placeholder="Search by amount..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            {/* Fees Table */}
                            {loading ? (
                                <div className="text-center">Loading...</div>
                            ) : filteredFees.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Amount (₹)</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredFees.map((fee, index) => (
                                                <tr key={fee.id}>
                                                    <td>{index + 1}</td>
                                                    <td>₹{fee.amount}</td>
                                                    <td>{fee.remarks}</td>
                                                    <td>
                                                        <span className={`badge ${fee.status === 0 ? "bg-warning" : "bg-success"}`}>
                                                            {fee.status === 0 ? "Pending" : "Paid"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-danger">No fee records found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default ViewFees;
