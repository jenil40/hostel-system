const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage: storage });
router.post("/getAll", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.id, s.name, s.contact_number, s.gender,
                CONCAT('http://localhost:5000/uploads/', s.photo) AS photo,
                r.id AS roomid, r.type AS room_type
            FROM student s
            LEFT JOIN room r ON s.roomid = r.id
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Failed to fetch students" });
    }
});

//  Assign Room to Student
router.post("/assignRoom", async (req, res) => {
    const { studentId, roomId } = req.body;

    if (!studentId || !roomId) {
        return res.status(400).json({ message: "Student ID and Room ID are required" });
    }
    try {
        const [roomCheck] = await db.query("SELECT * FROM room WHERE id = ?", [roomId]);

        if (roomCheck.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }
        await db.query("UPDATE student SET roomid = ? WHERE id = ?", [roomId, studentId]);

        res.json({ message: "Room assigned successfully" });
    } catch (error) {
        console.error("Error assigning room:", error);
        res.status(500).json({ message: "Failed to assign room" });
    }
});


router.post("/getById", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });
    try {
        const [rows] = await db.query(`
            SELECT s.*, 
                CONCAT('http://localhost:5000/uploads/', s.photo) AS photo,
                r.id AS roomid,
                r.type AS room_type,
                r.status AS room_status
            FROM student s
            LEFT JOIN room r ON s.roomid = r.id
            WHERE s.id = ?
        `, [id]);

        if (rows.length === 0) return res.status(404).json({ message: "Student not found" });

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ message: "Failed to fetch student" });
    }
});

//  Insert New Student (Updated API)
router.post("/insert", upload.single("photo"), async (req, res) => {
    const { name, contact_number, email, password, emergency_number, roomid, dob, gender, caste, medical_condition } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!name || !contact_number || !email || !password || !emergency_number || !roomid || !dob || gender === undefined || !caste || !photo || !medical_condition) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing
        const [result] = await db.query(
            "INSERT INTO student (name, contact_number, email, password, emergency_number, roomid, dob, gender, caste, photo, medical_condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, contact_number, email, hashedPassword, emergency_number, roomid, dob, gender, caste, photo, medical_condition]
        );

        res.json({ message: "Student registered successfully", id: result.insertId });
    } catch (error) {
        console.error("Error inserting student:", error);
        res.status(500).json({ message: "Failed to register student" });
    }
});


//  Delete Student by ID
router.post("/delete", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });

    try {
        const [result] = await db.query("DELETE FROM student WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Failed to delete student" });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const [student] = await db.query("SELECT * FROM student WHERE email = ?", [email]);
        if (student.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        // Check password (assuming passwords are hashed)
        const validPassword = await bcrypt.compare(password, student[0].password);
        if (!validPassword) return res.status(401).json({ message: "Invalid email or password" });

        // Generate JWT token
        const token = jwt.sign({ id: student[0].id, userType: "student" }, "secret_key", { expiresIn: "1h" });

        res.json({ message: "Student login successful", token , id : student[0].id });
    } catch (error) {
        console.error("Student login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

//  Change Password for User
router.post("/change-password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user exists
        const [user] = await db.query("SELECT * FROM student WHERE email = ?", [email]);
        if (user.length === 0) return res.status(404).json({ message: "User not found" });

        // Check if current password is correct
        const validPassword = await bcrypt.compare(currentPassword, user[0].password);
        if (!validPassword) return res.status(400).json({ message: "Current password is incorrect" });

        // Hash new password and update it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE student SET password = ? WHERE email = ?", [hashedPassword, email]);

        res.json({ message: "Password changed successfully!" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});

router.post("/apply-leave", async (req, res) => {
    const { student_id, start_date, end_date, reason } = req.body;

    if (!student_id || !start_date || !end_date || !reason) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        await db.query("INSERT INTO studentLeave (student_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, 0)", 
            [student_id, start_date, end_date, reason]
        );

        res.json({ message: "Leave application submitted successfully!" });
    } catch (error) {
        console.error("Apply Leave Error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});
router.get("/leaves/:student_id", async (req, res) => {
    const { student_id } = req.params;

    if (!student_id) {
        return res.status(400).json({ message: "Student ID is required" });
    }
    try {
        const [leaves] = await db.query("SELECT * FROM studentLeave WHERE student_id = ?", [student_id]);

        res.json(leaves);
    } catch (error) {
        console.error("Fetch Student Leaves Error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});


module.exports = router;
