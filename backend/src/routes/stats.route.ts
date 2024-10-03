import express from "express";
import { isAdmin, isAuthenticated } from "../utils/auth.middleware";
import { getDashboardStats, getTopProducts, getRevenueData } from "../Controllers/stat.controller";

const router = express.Router();

router.get("/stats", isAuthenticated, isAdmin, getDashboardStats);
router.get("/top-products", isAuthenticated, isAdmin, getTopProducts);
router.get("/revenue", isAuthenticated, isAdmin, getRevenueData);

export default router;