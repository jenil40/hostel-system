import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const studentId = localStorage.getItem("studentId");

    useEffect(() => {
        if (!studentId) {
            toast.error("Student ID not found. Please login again!", { position: "bottom-center", theme: "dark" });
            return;
        }

        fetchLeaves();
    }, []);

    // ✅ Fetch Leave Data
    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/student/leaves/${studentId}`);
            setLeaves(response.data);
        } catch (error) {
            toast.error("Error fetching leave records!", { position: "bottom-center", theme: "dark" });
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Format Date in DD-MM-YYYY (Indian Format)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // ✅ Filter Leaves based on Search
    const filteredLeaves = leaves.filter((leave) =>
        leave.reason.toLowerCase().includes(search.toLowerCase()) ||
        formatDate(leave.start_date).includes(search) ||
        formatDate(leave.end_date).includes(search) ||
        (leave.status === 0 ? "Pending" : "Approved").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="content">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="card p-5 shadow">
                            <h1 className="header-title mb-4">Your Leave Applications</h1>

                            {/* Search Bar */}
                            <div className="mb-3 text-end">
                                <input
                                    type="text"
                                    className="form-control w-50 d-inline"
                                    placeholder="Search by date, reason, or status..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Leave Table */}
                            {loading ? (
                                <div className="text-center">Loading...</div>
                            ) : filteredLeaves.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredLeaves.map((leave, index) => (
                                                <tr key={leave.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{formatDate(leave.start_date)}</td>
                                                    <td>{formatDate(leave.end_date)}</td>
                                                    <td>{leave.reason}</td>
                                                    <td>
                                                        <span className={`badge ${leave.status === 0 ? "bg-warning" : "bg-success"}`}>
                                                            {leave.status === 0 ? "Pending" : "Approved"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-danger">No leave applications found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default ViewLeaves;