const express = require("express");
const router = express.Router();
const db = require("../db");

//  Get All Fees (with student details)
router.post("/getAll", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT fees.*, student.name AS student_name, student.contact_number 
             FROM fees 
             JOIN student ON fees.student_id = student.id`
        );
        res.json(rows);
    } catch (error) {
        console.error("Error fetching fees:", error);
        res.status(500).json({ message: "Failed to fetch fees" });
    }
});

//  Get Fee by ID (with student details)
router.post("/getById", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });
    try {
        const [rows] = await db.query(
            `SELECT fees.*, student.name AS student_name, student.contact_number 
             FROM fees 
             JOIN student ON fees.student_id = student.id 
             WHERE fees.id = ?`,
            [id]
        );

        if (rows.length === 0) return res.status(404).json({ message: "Fee record not found" });

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching fee record:", error);
        res.status(500).json({ message: "Failed to fetch fee record" });
    }
});
//  Insert New Fee Record
router.post("/insert", async (req, res) => {
    const { student_id, amount, remarks } = req.body;

    if (!student_id || !amount || !remarks) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO fees (student_id, amount, remarks) VALUES (?, ?, ?)",
            [student_id, amount, remarks]
        );

        res.json({ message: "Fee record added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error inserting fee record:", error);
        res.status(500).json({ message: "Failed to insert fee record" });
    }
});

//  Delete Fee Record by ID
router.post("/delete", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });

    try {
        const [result] = await db.query("DELETE FROM fees WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Fee record not found" });

        res.json({ message: "Fee record deleted successfully" });
    } catch (error) {
        console.error("Error deleting fee record:", error);
        res.status(500).json({ message: "Failed to delete fee record" });
    }
});

router.get("/getFee/:studentId", async (req, res) => {
    const { studentId } = req.params;

    try {
        const [fees] = await db.query(`
            SELECT f.id, f.amount, f.remarks
            FROM fees f
            WHERE f.student_id = ?
        `, [studentId]);
        res.json(fees);
    } catch (error) {
        console.error("Error fetching student fees:", error);
        res.status(500).json({ message: "Error fetching fees data" });
    }
});

//  Update Fee Record by ID
router.post("/update", async (req, res) => {
    const { id, amount, remarks } = req.body;

    // Validation: Ensure all required fields are present
    if (!id || !amount) {
        return res.status(400).json({ message: "Fee ID and amount are required" });
    }

    try {
        const [result] = await db.query(
            "UPDATE fees SET amount = ?, remarks = ? WHERE id = ?",
            [amount, remarks, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Fee record not found" });
        }

        res.json({ message: "Fee record updated successfully" });
    } catch (error) {
        console.error("Error updating fee record:", error);
        res.status(500).json({ message: "Failed to update fee record" });
    }
});



module.exports = router;
