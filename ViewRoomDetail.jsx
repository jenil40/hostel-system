import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewRoomDetail = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/room/getById", { id: roomId });
                setRoom(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch room details");
                setLoading(false);
                toast.error("Error fetching room details!", { position: "bottom-center", theme: "dark" });
            }
        };
        fetchRoomDetails();
    }, [roomId]);

    if (loading) return <p className="text-center">Loading room details...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">Room Details</h1>
                </div>

                <div className="row">
                    <div className="col-md-8 mx-auto">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Room Information</h5>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>Room No</th>
                                            <td>{"R" + room.id}</td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td>{room.type === "0" ? "Single" : room.type === "1" ? "Shared" : "Deluxe"}</td>
                                        </tr>
                                        <tr>
                                            <th>Availability</th>
                                            <td className={room.status === "1" ? "text-success" : "text-danger"}>
                                                {room.status === "1" ? "Available" : "Not Available"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Maintenance</th>
                                            <td className={room.maintain_status === "1" ? "text-success" : "text-warning"}>
                                                {room.maintain_status === "1" ? "Maintained" : "Not Maintained"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {room.students && room.students.length > 0 ? (
                            <div className="card mt-3">
                                <div className="card-header">
                                    <h5 className="card-title">Assigned Students</h5>
                                </div>
                                <div className="card-body">
                                    <table className="table table-bordered text-center">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Student Name</th>
                                                <th>Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {room.students.map((student) => (
                                                <tr key={student.id}>
                                                    <td>{student.id}</td>
                                                    <td>{student.name}</td>
                                                    <td>{student.contact_number}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center mt-3 text-warning">No students assigned to this room.</p>
                        )}

                        <div className="text-center mt-3">
                            <button className="btn btn-secondary" onClick={() => navigate("/view-room")}>
                                Back to Room List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default ViewRoomDetail;
