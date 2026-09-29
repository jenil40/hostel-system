const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//  Admin Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const [admin] = await db.query("SELECT * FROM admin WHERE email = ?", [email]);
        if (admin.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        // Check password (assuming passwords are hashed)
        const validPassword = await bcrypt.compare(password, admin[0].password);
        if (!validPassword) return res.status(401).json({ message: "Invalid email or password" });
        // Generate JWT token
        const token = jwt.sign({ id: admin[0].id, userType: "admin" }, "secret_key", { expiresIn: "1h" });
        
        res.json({ message: "Admin login successful", token });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});


router.post("/change-password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Check if admin exists
        const [admin] = await db.query("SELECT * FROM admin WHERE email = ?", [email]);
        if (admin.length === 0) return res.status(404).json({ message: "Admin not found" });

        // Check if current password is correct
        const validPassword = await bcrypt.compare(currentPassword, admin[0].password);
        if (!validPassword) return res.status(400).json({ message: "Current password is incorrect" });

        // Hash new password and update it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE admin SET password = ? WHERE email = ?", [hashedPassword, email]);

        res.json({ message: "Password changed successfully!" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});





module.exports = router;
