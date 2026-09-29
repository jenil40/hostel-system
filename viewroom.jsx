import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ViewRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]); // For Search
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Search Term
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    // Fetch Rooms
    const fetchRooms = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/room/getAll");
            const formattedData = response.data.map((item, index) => ({
                ...item,
                serial: index + 1, // Adding Serial Number
                room_no: "R" + item.id, // Format Room Number
                type: item.type == "0" ? "Single" : item.type == "1" ? "Shared" : "Deluxe",
                status: item.status == "1" ? "Available" : "Not Available",
                maintenance: item.maintain_status == "1" ? "Maintained" : "Not Maintained",
            }));

            setRooms(formattedData);
            setFilteredRooms(formattedData); // Initialize search data
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch rooms");
            setLoading(false);
            toast.error("Error fetching rooms!", { position: "bottom-center", theme: "dark" });
        }
    };

    // Delete Room
    const handleDelete = async () => {
        try {
            await axios.post("http://localhost:5000/api/room/delete", { id: deleteId });
            toast.success("Room deleted successfully!", { position: "bottom-center", theme: "dark" });
            fetchRooms();
            setDeleteId(null);
        } catch (error) {
            toast.error("Failed to delete room!", { position: "bottom-center", theme: "dark" });
        }
    };

    // Handle Edit
    const handleEdit = (id) => {
        navigate(`/add-room/${id}`);
    };

    // Search Functionality
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredRooms(
            rooms.filter((room) =>
                room.room_no.toLowerCase().includes(term) ||
                room.type.toLowerCase().includes(term) ||
                room.status.toLowerCase().includes(term) ||
                room.maintenance.toLowerCase().includes(term)
            )
        );
    };

    const columns = [
        { name: "S.No", selector: (row) => row.serial, width: "70px", sortable: false },
        { name: "Room No", selector: (row) => row.room_no, sortable: true },
        { name: "Type", selector: (row) => row.type, sortable: true },
        { name: "Status", selector: (row) => row.status, sortable: true },
        { name: "Maintenance", selector: (row) => row.maintenance, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <>
                    <button className="btn btn-info btn-sm me-2" onClick={() => navigate(`/view-room-detail/${row.id}`)}>
                        <FaEye />
                    </button>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(row.id)}>
                        <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(row.id)}>
                        <FaTrash />
                    </button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true
        }
    ];

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h1 className="header-title">View Rooms</h1>
                        <button className="btn btn-light" onClick={() => navigate("/add-room")}>Add Room</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Rooms List</h5>
                                <input
                                    type="text"
                                    placeholder="Search rooms..."
                                    className="form-control mt-2"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <p>Loading rooms...</p>
                                ) : error ? (
                                    <p className="text-danger">{error}</p>
                                ) : (
                                    <DataTable
                                        columns={columns}
                                        data={filteredRooms}
                                        pagination
                                        highlightOnHover
                                        responsive
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button className="btn-close" onClick={() => setDeleteId(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this room?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default ViewRoom;
