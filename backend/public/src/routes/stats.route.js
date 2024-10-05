"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../utils/auth.middleware");
const stat_controller_1 = require("../Controllers/stat.controller");
const router = express_1.default.Router();
router.get("/stats", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, stat_controller_1.getDashboardStats);
router.get("/top-products", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, stat_controller_1.getTopProducts);
router.get("/revenue", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, stat_controller_1.getRevenueData);
exports.default = router;
