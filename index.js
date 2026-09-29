const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const assetRoutes = require("./routes/assets");
const feesRoutes = require("./routes/fees");
const roomRoutes = require("./routes/room");
const studentRoutes = require("./routes/student");
const studentLeaveRoutes = require("./routes/studentLeave");
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/assets", assetRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/studentLeave", studentLeaveRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SHOW TABLES;");
        const bcrypt = require("bcrypt");

        async function generateHashedPassword(password) {
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log("Hashed Password:", hashedPassword);
        }

        generateHashedPassword("Admin@123"); // Replace with the password you want to hash

        res.json(rows);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ message: "Database query failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
