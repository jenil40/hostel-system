const express = require("express");
const router = express.Router();
const db = require("../db");

//  Get All Rooms
router.post("/getAll", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM room");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
});
//  Get Room by ID
router.post("/getById", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Room ID is required" });
    try {
        // Fetch room details
        const [room] = await db.query(
            `SELECT * FROM room WHERE id = ?`,
            [id]
        );

        if (room.length === 0) return res.status(404).json({ message: "Room not found" });

        // Fetch all students assigned to this room
        const [students] = await db.query(
            `SELECT id, name, contact_number FROM student WHERE roomid = ?`,
            [id]
        );

        // Return room details along with the list of students
        res.json({
            ...room[0], 
            students: students.length > 0 ? students : []
        });

    } catch (error) {
        console.error("Error fetching room details:", error);
        res.status(500).json({ message: "Failed to fetch room details" });
    }
});

//  Insert New Room
router.post("/insert", async (req, res) => {
    const { id, type, status, maintain_status } = req.body;

    if (type === undefined || status === undefined || maintain_status === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        if (id) {
            // Update the existing record if id is provided
            const [result] = await db.query(
                "UPDATE room SET type = ?, status = ?, maintain_status = ? WHERE id = ?",
                [type, status, maintain_status, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.json({ message: "Room updated successfully" });
        } else {
            // Insert a new record if id is not provided
            const [result] = await db.query(
                "INSERT INTO room (type, status, maintain_status) VALUES (?, ?, ?)",
                [type, status, maintain_status]
            );
            res.json({ message: "Room added successfully", id: result.insertId });
        }
    } catch (error) {
        console.error("Error inserting/updating room:", error);
        res.status(500).json({ message: "Failed to insert/update room" });
    }
});
//  Delete Room by ID
router.post("/delete", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });

    try {
        const [result] = await db.query("DELETE FROM room WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Room not found" });

        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ message: "Failed to delete room" });
    }
});

module.exports = router;
