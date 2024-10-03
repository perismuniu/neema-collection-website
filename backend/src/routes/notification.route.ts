import express from "express";
import { isAuthenticated } from "../utils/auth.middleware";
import { getNotifications } from "../Controllers/notification.controller";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);

export default router;