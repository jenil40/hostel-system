import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBed, FaUsers, FaCogs, FaMoneyBill, FaTools, FaClipboardList } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css"; // Import the custom CSS file

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/dashboard/summary");
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load dashboard data");
                setLoading(false);
                toast.error("Error fetching dashboard data!", { position: "bottom-center", theme: "dark" });
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="loading-spinner"><div className="spinner"></div><p>Loading dashboard...</p></div>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <main className="dashboard-content" style={{ position : "relative"  , zIndex : "9999999999999999" , marginTop : "10.5px"}}>
            <div className="container-fluid">
                <h1 className="dashboard-title">Hostel Management Dashboard</h1>

                <div className="stats-grid">
                    {/* Room Summary */}
                    <div className="stat-card rooms-card">
                        <div className="icon-container">
                            <FaBed size={30} />
                        </div>
                        <div className="stat-content">
                            <h5>Total Rooms</h5>
                            <h3>{data.total_rooms}</h3>
                        </div>
                    </div>

                    <div className="stat-card available-card">
                        <div className="icon-container">
                            <FaBed size={30} />
                        </div>
                        <div className="stat-content">
                            <h5>Available Rooms</h5>
                            <h3>{data.available_rooms}</h3>
                        </div>
                    </div>

                    <div className="stat-card occupied-card">
                        <div className="icon-container">
                            <FaBed size={30} />
                        </div>
                        <div className="stat-content">
                            <h5>Occupied Rooms</h5>
                            <h3>{data.occupied_rooms}</h3>
                        </div>
                    </div>

                    {/* Students & Assets */}
                    <div className="stat-card students-card">
                        <div className="icon-container">
                            <FaUsers size={30} />
                        </div>
                        <div className="stat-content">
                            <h5>Total Students</h5>
                            <h3>{data.total_students}</h3>
                        </div>
                    </div>

                    <div className="stat-card assets-card">
                        <div className="icon-container">
                            <FaCogs size={30} />
                        </div>
                        <div className="stat-content">
                            <h5>Total Assets</h5>
                            <h3>{data.total_assets}</h3>
                        </div>
                    </div>

                    {/* Fees Collected */}
                    <div className="stat-card fees-card">
                        <div className="icon-container">
                            <FaMoneyBill size={30} />
                        </div>
                        <div className="stat-content">
                            <h5>Total Fees Collected</h5>
                            <h3>₹{data.total_fees}</h3>
                        </div>
                    </div>

                    {/* Maintenance & Leaves */}
                    <div className="stat-card maintenance-card">
                        <div className="icon-container">
                            <FaTools size={30} />
                        </div>
                        <div className="stat-content">
                            <h5>Rooms Needing Maintenance</h5>
                            <h3>{data.maintenance_needed}</h3>
                        </div>
                    </div>

                    <div className="stat-card leaves-card">
                        <div className="icon-container">
                            <FaClipboardList size={30} />
                        </div>
                        <div className="stat-content">
                            <h5>Pending Leave Requests</h5>
                            <h3>{data.pending_leaves}</h3>
                        </div>
                    </div>
                </div>

                {/* Recent Students */}
                <div className="recent-students-card">
                    <h5>Recent Students</h5>
                    <ul className="student-list">
                        {data.recent_students.map((student, index) => (
                            <li key={index} className="student-item">
                                <div className="student-avatar">{student.name.charAt(0)}</div>
                                <div className="student-info">
                                    <span className="student-name">{student.name}</span>
                                    <span className="student-contact">{student.contact_number}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default Dashboard;