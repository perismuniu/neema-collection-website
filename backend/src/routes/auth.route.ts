import { Response, Router } from "express";
import {
  dashboard,
  login,
  logout,
  register,
} from "../Controllers/auth.controller";
import { isAuthenticated } from "../utils/auth.middleware";
const fs = require("fs").promises;
import path from "path";
import { UserModel } from "../Models/user.model";
import crypto from "crypto";
import nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/logout", logout);
router.get("/auth/profile", isAuthenticated, dashboard);
// Google OAuth routes
// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/dashboard'); // Redirect to your desired route after successful login
//   }
// );
router.get("/auth", isAuthenticated, (req: any, res: Response) => {
  const { wallet } = req.user;
  if (req.user.isAdmin) {
    return res.status(200).json({ isAdmin: true, isAuthenticated: true });
  }

  res.status(200).json({ isAdmin: false, isAuthenticated: true, wallet });
});

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Store reset codes with expiration time
  const resetCodes = new Map();
  
  // Read email template
  const getEmailTemplate = async () => {
    const templatePath = path.join(
      __dirname,
      "email",
      "password-reset.html"
    );
    return await fs.readFile(templatePath, "utf8");
  };
  
  router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await UserModel.findOne({ email }); // Changed from find() to findOne()
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate a 6-digit code
      const resetCode = (await crypto.randomBytes(3)).toString("hex");
      const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
      resetCodes.set(email, { code: resetCode, expiration: expirationTime });
  
      // Get email template and replace placeholders
      let emailTemplate = await getEmailTemplate();
      emailTemplate = emailTemplate.replace("{resetCode}", resetCode);
  
      // Send email with reset code
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Code - Neema Collection",
        html: emailTemplate,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        message: "Reset code sent successfully. The code will expire in 5 minutes.",
      });
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  });

router.post("/verify-reset-code", async (req, res) => {
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
  } else {
    res.status(400).json({ message: "Invalid code" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  const storedData = resetCodes.get(email);
  if (!storedData || storedData.code !== code) {
    return res.status(400).json({ message: "Invalid or expired reset code" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Update the user's password
    user.set({ password: hashedPassword });
    await user.save();
  
    // Remove the reset code
    resetCodes.delete(email);
  
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

export default router;
