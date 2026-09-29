const express = require("express");
const router = express.Router();
const db = require("../db");

//  Get Counts for Dashboard
router.get("/counts", async (req, res) => {
    try {
        const [roomCount] = await db.query("SELECT COUNT(*) AS total_rooms FROM room");
        const [studentCount] = await db.query("SELECT COUNT(*) AS total_students FROM student");
        const [assetCount] = await db.query("SELECT COUNT(*) AS total_assets FROM assets");

        res.json({
            total_rooms: roomCount[0].total_rooms,
            total_students: studentCount[0].total_students,
            total_assets: assetCount[0].total_assets
        });
    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
});
router.get("/summary", async (req, res) => {
    try {
        const [totalRooms] = await db.query("SELECT COUNT(*) AS total_rooms FROM room");
        const [occupiedRooms] = await db.query("SELECT COUNT(*) AS occupied_rooms FROM room WHERE status = 0");
        const [availableRooms] = await db.query("SELECT COUNT(*) AS available_rooms FROM room WHERE status = 1");
        const [totalStudents] = await db.query("SELECT COUNT(*) AS total_students FROM student");
        const [totalAssets] = await db.query("SELECT COUNT(*) AS total_assets FROM assets");
        const [totalFees] = await db.query("SELECT SUM(amount) AS total_fees FROM fees");
        const [pendingLeaves] = await db.query("SELECT COUNT(*) AS pending_leaves FROM studentLeave WHERE status = 0");
        const [approvedLeaves] = await db.query("SELECT COUNT(*) AS approved_leaves FROM studentLeave WHERE status = 1");
        const [recentStudents] = await db.query("SELECT name, contact_number FROM student ORDER BY id DESC LIMIT 5");
        const [recentAssets] = await db.query("SELECT title, price, purchase_date FROM assets ORDER BY purchase_date DESC LIMIT 5");
        const [roomsNeedingMaintenance] = await db.query("SELECT COUNT(*) AS maintenance_needed FROM room WHERE maintain_status = 0");
        const [studentsPerRoomType] = await db.query(`
            SELECT room.type, COUNT(student.id) AS student_count 
            FROM student 
            JOIN room ON student.roomid = room.id 
            GROUP BY room.type
        `);

        res.json({
            total_rooms: totalRooms[0].total_rooms,
            available_rooms: availableRooms[0].available_rooms,
            occupied_rooms: occupiedRooms[0].occupied_rooms,
            total_students: totalStudents[0].total_students,
            total_assets: totalAssets[0].total_assets,
            total_fees: totalFees[0].total_fees || 0,
            pending_leaves: pendingLeaves[0].pending_leaves,
            approved_leaves: approvedLeaves[0].approved_leaves,
            recent_students: recentStudents,
            recent_assets: recentAssets,
            maintenance_needed: roomsNeedingMaintenance[0].maintenance_needed,
            students_per_room_type: studentsPerRoomType,
        });
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
});


module.exports = router;
