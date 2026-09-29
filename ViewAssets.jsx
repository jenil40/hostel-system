import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ViewAssets = () => {
    const [assets, setAssets] = useState([]);
    const [filteredAssets, setFilteredAssets] = useState([]); // For Search
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssets();
    }, []);

    // Fetch Assets
    const fetchAssets = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/assets/getAll");
            const formattedData = response.data.map((item, index) => ({
                ...item,
                serial: index + 1, // Add Serial Number
                purchase_date: formatDateToIndian(item.purchase_date),
            }));

            setAssets(formattedData);
            setFilteredAssets(formattedData); // Initialize search data
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch assets");
            setLoading(false);
            toast.error("Error fetching assets!", { position: "bottom-center", theme: "dark" });
        }
    };

    // Delete Asset
    const handleDelete = async () => {
        try {
            await axios.post("http://localhost:5000/api/assets/delete", { id: deleteId });
            toast.success("Asset deleted successfully!", { position: "bottom-center", theme: "dark" });
            fetchAssets();
            setDeleteId(null);
        } catch (error) {
            toast.error("Failed to delete asset!", { position: "bottom-center", theme: "dark" });
        }
    };

    // Format Date to Indian Format (DD-MM-YYYY)
    const formatDateToIndian = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Handle Edit
    const handleEdit = (id) => {
        navigate(`/add-asset/${id}`);
    };

    // Search Functionality
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredAssets(
            assets.filter((asset) =>
                asset.title.toLowerCase().includes(term) ||
                asset.vendor_name?.toLowerCase().includes(term) ||
                asset.purchase_date.includes(term)
            )
        );
    };

    const columns = [
        { name: "S.No", selector: (row) => row.serial, width: "70px", sortable: false },
        { name: "Title", selector: (row) => row.title, sortable: true },
        { name: "Price", selector: (row) => `₹${row.price}`, sortable: true },
        { name: "Purchase Date", selector: (row) => row.purchase_date, sortable: true },
        { name: "Vendor", selector: (row) => row.vendor_name || "N/A", sortable: true },
        {
            name: "Bill",
            cell: (row) => row.bill_url ? (
                <a href={row.bill_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                    View Bill
                </a>
            ) : "No Bill",
            ignoreRowClick: true
        },
        {
            name: "Actions",
            cell: (row) => (
                <>
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
                        <h1 className="header-title">View Assets</h1>
                        <button className="btn btn-light" onClick={() => navigate("/add-asset")}>Add Asset</button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Assets List</h5>
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="form-control mt-2"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <p>Loading assets...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredAssets}
                                pagination
                                highlightOnHover
                                responsive
                            />
                        )}
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
                                <p>Are you sure you want to delete this asset?</p>
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

export default ViewAssets;
