import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewStudentLeave = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "approve", "discard", "delete"
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchLeave();
    }, []);

    //  Fetch Leave Details
    const fetchLeave = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/studentLeave/getById", { id });
            setLeave(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching leave record:", error);
            setLoading(false);
        }
    };

    //  Check if leave cannot be modified (approved & start date is today or future)
    const isLeaveLocked = leave?.status === 1 && moment(leave.start_date).isSameOrAfter(moment());

    //  Handle Leave Status Update (Approve/Discard)
    const handleUpdateStatus = async (status) => {
        if (status === 0 && isLeaveLocked) {
            toast.error("Cannot discard leave that is already approved and has not started!", { position: "top-right" });
            return;
        }

        setUpdating(true);
        try {
            await axios.post("http://localhost:5000/api/studentLeave/updateStatus", { id, status });
            toast.success(`Leave ${status === 1 ? "Approved" : "Discarded"} Successfully!`, { position: "top-right" });
            fetchLeave();
        } catch (error) {
            console.error("Error updating leave status:", error);
            toast.error("Failed to update leave status", { position: "top-right" });
        }
        setUpdating(false);
        setShowModal(false);
    };

    //  Handle Leave Deletion
    const handleDeleteLeave = async () => {
        setDeleting(true);
        setShowModal(false);

        try {
            await axios.post("http://localhost:5000/api/studentLeave/delete", { id });
            toast.success("Leave record deleted successfully!", { position: "top-right" });
            navigate("/student-leave");
        } catch (error) {
            console.error("Error deleting leave record:", error);
            toast.error("Failed to delete leave record", { position: "top-right" });
        }

        setDeleting(false);
    };

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">Student Leave Details</h1>
                </div>

                {loading ? (
                    <p>Loading leave details...</p>
                ) : leave ? (
                    <div className="card shadow-sm p-4">
                        <div className="row">
                            {/* Left Section: Student Details */}
                            <div className="col-md-4 text-center">
                                <h4 className="mt-3">{leave.student_name}</h4>
                                <p className="text-muted">Contact: {leave.contact_number}</p>
                            </div>

                            {/* Right Section: Leave Details */}
                            <div className="col-md-8">
                                <ul className="list-group">
                                    <li className="list-group-item"><strong>Leave From:</strong> {moment(leave.start_date).format("DD-MM-YYYY")}</li>
                                    <li className="list-group-item"><strong>Leave To:</strong> {moment(leave.end_date).format("DD-MM-YYYY")}</li>
                                    <li className="list-group-item"><strong>Reason:</strong> {leave.reason}</li>
                                    <li className="list-group-item">
                                        <strong>Status:</strong>{" "}
                                        <span className={`badge ${leave.status === 1 ? "bg-success" : "bg-warning"}`}>
                                            {leave.status === 1 ? "Approved" : "Pending"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="text-center mt-4">
                            {leave.status === 0 && (
                                <button
                                    className="btn btn-success me-2"
                                    onClick={() => { setModalType("approve"); setShowModal(true); }}
                                    disabled={updating}
                                >
                                    {updating ? "Approving..." : "Approve Leave"}
                                </button>
                            )}
                            {leave.status === 1 && !isLeaveLocked && (
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => { setModalType("discard"); setShowModal(true); }}
                                    disabled={updating}
                                >
                                    {updating ? "Discarding..." : "Discard Leave"}
                                </button>
                            )}
                            <button
                                className="btn btn-danger me-2"
                                onClick={() => { setModalType("delete"); setShowModal(true); }}
                                disabled={isLeaveLocked}
                            >
                                Delete Leave
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate("/student-leave")}>
                                Back to Leave Records
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Leave record not found</p>
                )}
            </div>

            {/* Modal for Confirming Actions */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === "approve" ? "Confirm Approval" :
                            modalType === "discard" ? "Confirm Discard" :
                                "Confirm Deletion"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === "approve"
                        ? `Are you sure you want to approve leave for ${leave?.student_name}?`
                        : modalType === "delete"
                            ? `Are you sure you want to delete this leave record for ${leave?.student_name}?`
                            : `Are you sure you want to discard this approved leave for ${leave?.student_name}?`}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    {modalType === "approve" ? (
                        <Button variant="success" onClick={() => handleUpdateStatus(1)} disabled={updating}>
                            {updating ? "Approving..." : "Confirm"}
                        </Button>
                    ) : modalType === "delete" ? (
                        <Button variant="danger" onClick={handleDeleteLeave} disabled={deleting}>
                            {deleting ? "Deleting..." : "Confirm"}
                        </Button>
                    ) : (
                        <Button variant="warning" onClick={() => handleUpdateStatus(0)} disabled={updating}>
                            {updating ? "Discarding..." : "Confirm"}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </main>
    );
};

export default ViewStudentLeave;
