import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const ViewFees = () => {
    const navigate = useNavigate();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFee, setSelectedFee] = useState(null); // Track selected fee for deletion

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/fees/getAll");
                setFees(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch fee records");
                setLoading(false);
                toast.error("Error fetching fee records!", { position: "bottom-center", theme: "dark" });
            }
        };
        fetchFees();
    }, []);

    const handleDelete = async () => {
        if (!selectedFee) return;
        try {
            await axios.post("http://localhost:5000/api/fees/delete", { id: selectedFee.id });
            setFees(fees.filter(fee => fee.id !== selectedFee.id));
            toast.success("Fee record deleted successfully!", { position: "bottom-center", theme: "dark" });
        } catch (error) {
            toast.error("Failed to delete fee record!", { position: "bottom-center", theme: "dark" });
        } finally {
            setSelectedFee(null); // Reset modal state
        }
    };

    if (loading) return <p className="text-center">Loading fee records...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header" style={{ display : "flex",  justifyContent : "space-between"}}>
                    <h1 className="header-title">Fee Records</h1>
                    <button className="btn btn-light" onClick={() => navigate("/add-fee")}>
                        Add New Fee
                    </button>
                </div>

                <div className="row">
                    <div className="col-md-12 mx-auto">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Fees Information</h5>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered text-center">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Student Name</th>
                                            <th>Contact</th>
                                            <th>Amount</th>
                                            <th>Remarks</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fees.length > 0 ? (
                                            fees.map((fee) => (
                                                <tr key={fee.id}>
                                                    <td>{fee.id}</td>
                                                    <td>{fee.student_name}</td>
                                                    <td>{fee.contact_number}</td>
                                                    <td>₹{fee.amount}</td>
                                                    <td>{fee.remarks}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary me-2"
                                                            onClick={() => navigate(`/edit-fee/${fee.id}`)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteModal"
                                                            onClick={() => setSelectedFee(fee)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-warning text-center">
                                                    No fee records found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this fee record?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default ViewFees;
