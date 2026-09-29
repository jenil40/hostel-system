import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState({
        type: "",
        status: "",
        maintain_status: ""
    });

    const [errors, setErrors] = useState({}); // Validation Errors

    useEffect(() => {
        if (roomId) {
            axios.post("http://localhost:5000/api/room/getById", { id: roomId })
                .then((response) => {
                    setRoom(response.data);
                })
                .catch(() => {
                    toast.error("Failed to load room details", {
                        position: "bottom-center",
                        theme: "dark",
                        style: { backgroundColor: "#dc3545", color: "#fff" } // Red error
                    });
                });
        }
    }, [roomId]);

    // Validate Form
    const validate = () => {
        let tempErrors = {};

        if (!room.type) tempErrors.type = "Room Type is required.";
        if (!room.status) tempErrors.status = "Availability Status is required.";
        if (!room.maintain_status) tempErrors.maintain_status = "Maintenance Status is required.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setRoom({ ...room, [e.target.name]: e.target.value });

        // Remove validation error once field is filled
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fill all required fields.", {
                position: "bottom-center",
                theme: "dark",
                style: { backgroundColor: "#dc3545", color: "#fff" }
            });
            return;
        }

        try {
            const endpoint = roomId ? "insert" : "insert";
            const response = await axios.post(`http://localhost:5000/api/room/${endpoint}`, { id: roomId, ...room });

            if (response.status === 200) {
                toast.success(`Room ${roomId ? "updated" : "added"} successfully!`, {
                    position: "bottom-center",
                    theme: "dark",
                    style: { backgroundColor: "#28a745", color: "#fff" }
                });

                setTimeout(() => {
                    navigate("/view-room");
                }, 2000);
            } else {
                toast.error("Failed to save room. Try again!", {
                    position: "bottom-center",
                    theme: "dark",
                    style: { backgroundColor: "#dc3545", color: "#fff" }
                });
            }
        } catch (error) {
            toast.error("Error saving room!", {
                position: "bottom-center",
                theme: "dark",
                style: { backgroundColor: "#dc3545", color: "#fff" }
            });
            console.error("Error:", error);
        }
    };

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">{roomId ? "Edit Room" : "Add Room"}</h1>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Room Type</label>
                                        <select
                                            name="type"
                                            className={`form-control ${errors.type ? "is-invalid" : ""}`}
                                            value={room.type}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Room Type</option>
                                            <option value="0">Single</option>
                                            <option value="1">Shared</option>
                                            <option value="2">Deluxe</option>
                                        </select>
                                        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Availability Status</label>
                                        <select
                                            name="status"
                                            className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                            value={room.status}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="0">Not Available</option>
                                            <option value="1">Available</option>
                                        </select>
                                        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Maintenance Status</label>
                                        <select
                                            name="maintain_status"
                                            className={`form-control ${errors.maintain_status ? "is-invalid" : ""}`}
                                            value={room.maintain_status}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Maintenance Status</option>
                                            <option value="0">Not Maintained</option>
                                            <option value="1">Maintained</option>
                                        </select>
                                        {errors.maintain_status && <div className="invalid-feedback">{errors.maintain_status}</div>}
                                    </div>

                                    <div align="right">
                                        <button type="submit" className="btn btn-primary me-2">
                                            {roomId ? "Update Room" : "Add Room"}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/view-room")}>
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

export default AddRoom;
