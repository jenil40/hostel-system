const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://localhost:5000/uploads/";

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File filter: Only allow PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};
// Multer upload setup
const upload = multer({ storage: storage, fileFilter: fileFilter });

//  Get All Assets (with full bill path)
router.post("/getAll", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT *, CONCAT(?, bill) AS bill_url FROM assets", [BASE_URL]);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching assets:", error);
        res.status(500).json({ message: "Failed to fetch assets" });
    }
});
//  Get Asset by ID (with full bill path)
router.post("/getById", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });
    try {
        const [rows] = await db.query("SELECT *, CONCAT(?, bill) AS bill_url FROM assets WHERE id = ?", [BASE_URL, id]);
        if (rows.length === 0) return res.status(404).json({ message: "Asset not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching asset:", error);
        res.status(500).json({ message: "Failed to fetch asset" });
    }
});
//  Insert new asset
router.post("/insert", upload.single("bill"), async (req, res) => {
    const { title, price, purchase_date, vendor_name, remarks } = req.body;
    const billFile = req.file ? req.file.filename : null;

    if (!title || !price || !purchase_date || !remarks || !billFile) {
        return res.status(400).json({ message: "All fields are required, including a PDF bill" });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO assets (title, price, purchase_date, vendor_name, bill, remarks) VALUES (?, ?, ?, ?, ?, ?)",
            [title, price, purchase_date, vendor_name, billFile, remarks]
        );
        res.json({ message: "Asset added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error inserting asset:", error);
        res.status(500).json({ message: "Failed to insert asset" });
    }
});
//  Delete asset by ID
router.post("/delete", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });

    try {
        const [result] = await db.query("DELETE FROM assets WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Asset not found" });

        res.json({ message: "Asset deleted successfully" });
    } catch (error) {
        console.error("Error deleting asset:", error);
        res.status(500).json({ message: "Failed to delete asset" });
    }
});
router.post("/update", upload.single("bill"), async (req, res) => {
    const { id } = req.query;
    const { title, price, purchase_date, vendor_name, remarks } = req.body;
    const billFile = req.file ? req.file.filename : null;

    if (!id) return res.status(400).json({ message: "ID is required" });

    try {
        const updateQuery = billFile
            ? "UPDATE assets SET title=?, price=?, purchase_date=?, vendor_name=?, bill=?, remarks=? WHERE id=?"
            : "UPDATE assets SET title=?, price=?, purchase_date=?, vendor_name=?, remarks=? WHERE id=?";
        const values = billFile
            ? [title, price, purchase_date, vendor_name, billFile, remarks, id]
            : [title, price, purchase_date, vendor_name, remarks, id];

        await db.query(updateQuery, values);
        res.json({ message: "Asset updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update asset" });
    }
});


module.exports = router;
