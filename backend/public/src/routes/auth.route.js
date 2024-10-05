"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../Controllers/auth.controller");
const auth_middleware_1 = require("../utils/auth.middleware");
const fs = require("fs").promises;
const path_1 = __importDefault(require("path"));
const user_model_1 = require("../Models/user.model");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt = __importStar(require("bcrypt"));
const router = (0, express_1.Router)();
router.post("/auth/register", auth_controller_1.register);
router.post("/auth/login", auth_controller_1.login);
router.post("/auth/logout", auth_middleware_1.isAuthenticated, auth_controller_1.logout);
router.get("/auth/profile", auth_middleware_1.isAuthenticated, auth_controller_1.dashboard);
router.get('/verify-token', auth_middleware_1.isAuthenticated, auth_controller_1.verifyToken);
// Google OAuth routes
// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/dashboard'); // Redirect to your desired route after successful login
//   }
// );
router.get("/auth", auth_middleware_1.isAuthenticated, (req, res) => {
    const { wallet } = req.user;
    if (req.user.isAdmin) {
        return res.status(200).json({ isAdmin: true, isAuthenticated: true });
    }
    res.status(200).json({ isAdmin: false, isAuthenticated: true, wallet });
});
// Create a transporter for sending emails
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Store reset codes with expiration time
const resetCodes = new Map();
// Read email template
const getEmailTemplate = () => __awaiter(void 0, void 0, void 0, function* () {
    const templatePath = path_1.default.join(__dirname, "email", "password-reset.html");
    return yield fs.readFile(templatePath, "utf8");
});
router.post("/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_model_1.UserModel.findOne({ email }); // Changed from find() to findOne()
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate a 6-digit code
        const resetCode = (yield crypto_1.default.randomBytes(3)).toString("hex");
        const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        resetCodes.set(email, { code: resetCode, expiration: expirationTime });
        // Get email template and replace placeholders
        let emailTemplate = yield getEmailTemplate();
        emailTemplate = emailTemplate.replace("{resetCode}", resetCode);
        // Send email with reset code
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Code - Neema Collection",
            html: emailTemplate,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({
            message: "Reset code sent successfully. The code will expire in 5 minutes.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
}));
router.post("/verify-reset-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    const storedData = resetCodes.get(email);
    if (!storedData) {
        return res
            .status(400)
            .json({ message: "No reset code found for this email" });
    }
    if (Date.now() > storedData.expiration) {
        resetCodes.delete(email);
        return res.status(400).json({ message: "Reset code has expired" });
    }
    if (storedData.code === code) {
        // Don't delete the code yet, we'll need it for password reset
        res.status(200).json({ message: "Code verified successfully" });
    }
    else {
        res.status(400).json({ message: "Invalid code" });
    }
}));
router.post("/reset-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code, newPassword } = req.body;
    const storedData = resetCodes.get(email);
    if (!storedData || storedData.code !== code) {
        return res.status(400).json({ message: "Invalid or expired reset code" });
    }
    try {
        const user = yield user_model_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Hash the new password
        const hashedPassword = yield bcrypt.hash(newPassword, 10);
        // Update the user's password
        user.set({ password: hashedPassword });
        yield user.save();
        // Remove the reset code
        resetCodes.delete(email);
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
}));
exports.default = router;
