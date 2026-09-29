import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAsset = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        purchase_date: "",
        vendor_name: "",
        remarks: "",
        bill: null,
    });

    const [errors, setErrors] = useState({});
    const [existingBill, setExistingBill] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchAssetDetails();
        }
    }, [id]);

    const fetchAssetDetails = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/assets/getById", { id });
            const asset = response.data;

            const formattedDate = asset.purchase_date ? asset.purchase_date.split("T")[0] : "";

            setFormData({
                title: asset.title,
                price: asset.price,
                purchase_date: formattedDate,
                vendor_name: asset.vendor_name || "",
                remarks: asset.remarks,
                bill: null,
            });

            setExistingBill(asset.bill_url);
        } catch (error) {
            toast.error("Failed to fetch asset details!", { position: "bottom-center", theme: "dark" });
        }
    };

    const validate = () => {
        let tempErrors = {};

        if (!formData.title.trim()) tempErrors.title = "Title is required.";
        if (!formData.price || formData.price <= 0) tempErrors.price = "Price must be greater than zero.";
        if (!formData.purchase_date) tempErrors.purchase_date = "Purchase date is required.";
        if (!formData.remarks.trim()) tempErrors.remarks = "Remarks are required.";

        // File validation: Only required when adding a new asset (not editing)
        if (!id && !formData.bill) {
            tempErrors.bill = "Bill (PDF) is required.";
        } else if (formData.bill && formData.bill.type !== "application/pdf") {
            tempErrors.bill = "Only PDF files are allowed.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        setErrors({ ...errors, [name]: "" }); // Clear error when user types
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type !== "application/pdf") {
            setErrors({ ...errors, bill: "Only PDF files are allowed." });
            setFormData({ ...formData, bill: null });
        } else {
            setErrors({ ...errors, bill: "" });
            setFormData({ ...formData, bill: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors before submitting.", { position: "bottom-center", theme: "dark" });
            return;
        }

        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("purchase_date", formData.purchase_date);
        formDataToSend.append("vendor_name", formData.vendor_name);
        formDataToSend.append("remarks", formData.remarks);

        if (formData.bill) {
            formDataToSend.append("bill", formData.bill);
        }

        try {
            if (id) {
                await axios.post("http://localhost:5000/api/assets/update", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                    params: { id },
                });
                toast.success("✅ Asset updated successfully!", { position: "bottom-center", theme: "dark" });
            } else {
                await axios.post("http://localhost:5000/api/assets/insert", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("✅ Asset added successfully!", { position: "bottom-center", theme: "dark" });
            }

            setTimeout(() => {
                navigate("/view-assets");
            }, 2000);
        } catch (error) {
            toast.error("❌ Error saving asset!", { position: "bottom-center", theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="content">
            <div className="container-fluid">
                <div className="header">
                    <h1 className="header-title">{id ? "Edit Asset" : "Add Asset"}</h1>
                </div>

                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="title of assets goes here"
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="price of assets goes here"
                                />
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Purchase Date</label>
                                <input
                                    type="date"
                                    name="purchase_date"
                                    className={`form-control ${errors.purchase_date ? "is-invalid" : ""}`}
                                    value={formData.purchase_date}
                                    onChange={handleChange}
                                />
                                {errors.purchase_date && <div className="invalid-feedback">{errors.purchase_date}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Vendor Name</label>
                                <input type="text" name="vendor_name" className="form-control" value={formData.vendor_name} onChange={handleChange} 
                                placeholder="vendor name goes here "
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Remarks</label>
                                <textarea
                                    name="remarks"
                                    className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    placeholder="remarks goes here "
                                />
                                {errors.remarks && <div className="invalid-feedback">{errors.remarks}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Bill (PDF)</label>
                                <input
                                    type="file"
                                    name="bill"
                                    accept="application/pdf"
                                    className={`form-control ${errors.bill ? "is-invalid" : ""}`}
                                    onChange={handleFileChange}
                                />
                                {errors.bill && <div className="invalid-feedback">{errors.bill}</div>}
                                {existingBill && !formData.bill && (
                                    <p><a href={existingBill} target="_blank" rel="noopener noreferrer">View Existing Bill</a></p>
                                )}
                            </div>
                            <div align="right" style={{ display: "flex", gap: "15px", justifyContent: "end" }}>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Saving..." : id ? "Update Asset" : "Add Asset"}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => navigate("/view-assets   ")}>
                                    Back
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={3000} />
        </main>
    );
};

export default AddAsset;
