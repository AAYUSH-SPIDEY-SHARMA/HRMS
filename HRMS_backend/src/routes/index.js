const express = require("express");
const authRoutes = require("./auth.routes");
const attendanceRoutes = require("./attendance.routes");
const userRoutes = require("./user.routes");
const leaveRoutes = require("./leave.routes");
const payrollRoutes = require("./payroll.routes");
const prisma = require("../clients/prisma.client");
const ApiResponse = require("../utils/apiResponse.util");

const router = express.Router();

// Lightweight health check — runs a trivial query so an external ping keeps
// BOTH the Render service and the Neon database warm (avoids cold starts).
router.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ApiResponse.success(res, 200, "OK — service and database are awake", {
      status: "ok",
      db: "connected",
      time: new Date().toISOString(),
    });
  } catch (err) {
    return ApiResponse.error(res, 503, "Database unavailable", [err.message]);
  }
});

router.use("/auth", authRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/employees", userRoutes);
router.use("/leave", leaveRoutes);
router.use("/payroll", payrollRoutes);

module.exports = router;
