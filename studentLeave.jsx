import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";

const ViewStudentLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLeaves();
    }, []);

    //  Fetch Student Leave Data
    const fetchLeaves = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/studentLeave/getAll");
            setLeaves(response.data);
            setFilteredLeaves(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching student leaves:", error);
            setLoading(false);
        }
    };

    //  Search Functionality
    useEffect(() => {
        const result = leaves.filter((leave) =>
            leave.student_name.toLowerCase().includes(search.toLowerCase()) ||
            leave.contact_number.includes(search)
        );
        setFilteredLeaves(result);
    }, [search, leaves]);

    // Handle Delete with Confirmation Modal
    const confirmDeleteLeave = (leave) => {
        setSelectedLeave(leave);
        setShowModal(true);
    };

    const handleDeleteLeave = async () => {
        if (!selectedLeave) return;
        setDeleting(true);

        try {
            await axios.post("http://localhost:5000/api/studentLeave/delete", { id: selectedLeave.id });
            toast.success("Leave record deleted successfully!", { position: "top-right" });
            fetchLeaves();
        } catch (error) {
            console.error("Error deleting leave record:", error);
            toast.error("Failed to delete leave record", { position: "top-right" });
        }

        setShowModal(false);
        setDeleting(false);
    };

    //  Table Columns (Formatted Dates)
    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "80px",
        },
        { name: "Student Name", selector: (row) => row.student_name, sortable: true },
        { name: "Contact Number", selector: (row) => row.contact_number, sortable: true },
        {
            name: "From",
            selector: (row) => moment(row.start_date).format("DD-MM-YYYY"),
            sortable: true
        },
        {
            name: "To",
            selector: (row) => moment(row.end_date).format("DD-MM-YYYY"),
            sortable: true
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex">
                    <button className="btn btn-info btn-sm" onClick={() => navigate(`/view-student-leave/${row.id}`)}>
                        <FaEye />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true
        }
    ];

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">View Student Leaves</h1>
                </div>

                <div className="card">
                    <div className="card-body">
                        {/* 🔍 Search Input */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by Student Name or Contact"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* 📊 Data Table */}
                        {loading ? (
                            <p>Loading student leaves...</p>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredLeaves}
                                pagination
                                highlightOnHover
                                responsive
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ❗ Delete Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this leave record for <strong>{selectedLeave?.student_name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteLeave} disabled={deleting}>
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
};

export default ViewStudentLeaves;
