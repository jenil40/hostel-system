import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/student/getAll");
            setStudents(response.data);
            setFilteredStudents(response.data); // Initially, filtered = all data
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students:", error);
            setLoading(false);
        }
    };

    // 🔍 Search Functionality
    useEffect(() => {
        const result = students.filter((student) =>
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.contact_number.includes(search) ||
            (student.roomid && student.roomid.toString().includes(search))
        );
        setFilteredStudents(result);
    }, [search, students]);

    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "80px",
        },
        { name: "Name", selector: (row) => row.name, sortable: true },
        { name: "Contact Number", selector: (row) => row.contact_number, sortable: true },
        { name: "Gender", selector: (row) => (row.gender === 1 ? "Male" : "Female"), sortable: true },
        {
            name: "Room",
            selector: (row) => (row.roomid ? `R${row.roomid} (${row.room_type == "0" ? "Single" : row.room_type == "1" ? "Shared" : "Deluxe"})` : "No Room Assigned"),
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button className="btn btn-info btn-sm" onClick={() => navigate(`/view-student/${row.id}`)}>
                    <FaEye />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true
        }
    ];

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">View Students</h1>
                </div>

                <div className="card">
                    <div className="card-body">
                        {/* 🔍 Search Input */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by Name, Contact, or Room"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* 📊 Data Table */}
                        {loading ? (
                            <p>Loading students...</p>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredStudents}
                                pagination
                                highlightOnHover
                                responsive
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ViewStudents;
