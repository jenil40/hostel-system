import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
import { toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS

const ViewStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal State

    useEffect(() => {
        fetchStudent();
        fetchRooms();
    }, []);

    // ✅ Fetch Student Details
    const fetchStudent = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/student/getById", { id });
            setStudent(response.data);
            setSelectedRoom(response.data.roomid || "");
            setLoading(false);
        } catch (error) {
            console.error("Error fetching student:", error);
            setLoading(false);
        }
    };

    // ✅ Fetch Available Rooms
    const fetchRooms = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/room/getAll");
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    // ✅ Handle Room Assignment with Modal
    const handleAssignRoom = async () => {
        setAssigning(true);
        setShowModal(false);

        try {
            await axios.post("http://localhost:5000/api/student/assignRoom", { studentId: id, roomId: selectedRoom });
            toast.success("Room assigned successfully!", { position: "top-right" });
            fetchStudent();
        } catch (error) {
            console.error("Error assigning room:", error);
            toast.error("Failed to assign room", { position: "top-right" });
        }

        setAssigning(false);
    };

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">Student Details</h1>
                </div>

                {loading ? (
                    <p>Loading student details...</p>
                ) : student ? (
                    <div className="card shadow-sm p-4">
                        <div className="row">
                            {/* Left Section: Student Photo */}
                            <div className="col-md-4 text-center">
                                <img
                                    src={student.photo}
                                    alt="Student"
                                    className="rounded-circle shadow-sm"
                                    width="150"
                                    height="150"
                                />
                                <h4 className="mt-3">{student.name}</h4>
                                <p className="text-muted">{student.gender === 1 ? "Male" : "Female"}</p>
                            </div>

                            {/* Right Section: Student Info */}
                            <div className="col-md-8">
                                <ul className="list-group">
                                    <li className="list-group-item"><strong>Contact:</strong> {student.contact_number}</li>
                                    <li className="list-group-item"><strong>Emergency:</strong> {student.emergency_number}</li>
                                    <li className="list-group-item">
                                        <strong>Date of Birth:</strong> {moment(student.dob).format("DD-MM-YYYY")}
                                    </li>
                                    <li className="list-group-item"><strong>Caste:</strong> {student.caste}</li>
                                    <li className="list-group-item"><strong>Medical Condition:</strong> {student.medical_condition || "None"}</li>
                                    <li className="list-group-item">
                                        <strong>Room Details:</strong><br />
                                        {student.roomid ? (
                                            <>
                                                <span className="text-primary"><strong>Room No:</strong> R{student.roomid}</span><br />
                                                <span><strong>Type:</strong> {student.room_type == "0" ? "Single" : student.room_type == "1" ? "Shared" : "Deluxe"}</span><br />
                                                <span className={`badge ${student.room_status == "1" ? "bg-success" : "bg-danger"}`}>
                                                    {student.room_status == "1" ? "Available" : "Not Available"}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-danger">No room assigned</span>
                                        )}
                                    </li>

                                    {/* Room Assignment Dropdown */}
                                    <li className="list-group-item">
                                        <strong>Assign New Room:</strong>
                                        <div className="d-flex mt-2">
                                            <select
                                                className="form-select me-2"
                                                value={selectedRoom}
                                                onChange={(e) => setSelectedRoom(e.target.value)}
                                            >
                                                <option value="">Select Room</option>
                                                {rooms.map((room) => (
                                                    <option key={room.id} value={room.id}>
                                                        Room {room.id} ({room.type == "0" ? "Single" : room.type == "1" ? "Shared" : "Deluxe"})
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => setShowModal(true)}
                                                disabled={!selectedRoom}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="text-center mt-4">
                            <button className="btn btn-secondary" onClick={() => navigate("/view-students")}>
                                Back to Students
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Student not found</p>
                )}
            </div>

            {/* Modal for Confirmation */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Room Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to assign <strong>Room {selectedRoom}</strong> to {student?.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAssignRoom} disabled={assigning}>
                        {assigning ? "Assigning..." : "Confirm"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
};

export default ViewStudent;
