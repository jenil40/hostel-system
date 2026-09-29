const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get All Student Leave Requests
router.post("/getAll", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT studentLeave.*, student.name AS student_name, student.contact_number
            FROM studentLeave
            JOIN student ON studentLeave.student_id = student.id
        `);
        console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching student leaves:", error);
        res.status(500).json({ message: "Failed to fetch student leaves" });
    }
});

// ✅ Get Student Leave by ID
router.post("/getById", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });

    try {
        const [rows] = await db.query(`
            SELECT studentLeave.*, student.name AS student_name, student.contact_number
            FROM studentLeave
            JOIN student ON studentLeave.student_id = student.id
            WHERE studentLeave.id = ?
        `, [id]);

        if (rows.length === 0) return res.status(404).json({ message: "Leave record not found" });

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching leave record:", error);
        res.status(500).json({ message: "Failed to fetch leave record" });
    }
});

// ✅ Insert New Student Leave
router.post("/insert", async (req, res) => {
    const { student_id, start_date, end_date, status, reason } = req.body;

    if (!student_id || !start_date || !end_date || status === undefined || !reason) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO studentLeave (student_id, start_date, end_date, status, reason) VALUES (?, ?, ?, ?, ?)",
            [student_id, start_date, end_date, status, reason]
        );

        res.json({ message: "Leave request added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error inserting leave request:", error);
        res.status(500).json({ message: "Failed to insert leave request" });
    }
});

// ✅ Delete Student Leave by ID
router.post("/delete", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });

    try {
        const [result] = await db.query("DELETE FROM studentLeave WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Leave record not found" });

        res.json({ message: "Leave record deleted successfully" });
    } catch (error) {
        console.error("Error deleting leave record:", error);
        res.status(500).json({ message: "Failed to delete leave record" });
    }
});

router.post("/updateStatus", async (req, res) => {
    const { id, status } = req.body;

    if (!id || (status !== 0 && status !== 1)) {
        return res.status(400).json({ error: "Invalid request data" });
    }

    try {
        await db.query("UPDATE studentLeave SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: "Leave status updated successfully!" });
    } catch (error) {
        console.error("Error updating leave status:", error);
        res.status(500).json({ error: "Failed to update leave status" });
    }
});


module.exports = router;
