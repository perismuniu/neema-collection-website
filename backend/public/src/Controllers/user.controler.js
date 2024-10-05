"use strict";
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
exports.updatePassword = exports.updateProfile = exports.getUsers = exports.getUserSettings = exports.updateUserSettings = void 0;
const user_model_1 = require("../Models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const updateUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const updates = req.body;
        // Validate that only allowed settings are being updated
        const allowedSettings = ['showInactiveProducts', 'emailNotifications', 'pushNotifications', 'twoFactorAuth'];
        const updatesObj = {};
        console.log('user.controller line 13', Object.entries(updates));
        for (const [key, value] of Object.entries(updates)) {
            if (allowedSettings.includes(key)) {
                updatesObj[`adminSettings.${key}`] = value;
            }
        }
        const user = yield user_model_1.UserModel.findByIdAndUpdate(userId, { $set: updatesObj }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Settings updated successfully', adminSettings: user.adminSettings });
    }
    catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
});
exports.updateUserSettings = updateUserSettings;
const getUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const user = yield user_model_1.UserModel.findById(userId).select('adminSettings isAdmin');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        res.json({
            isAdmin: user.isAdmin,
            adminSettings: user.adminSettings
        });
    }
    catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
});
exports.getUserSettings = getUserSettings;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.UserModel.aggregate([
            {
                $match: { isAdmin: false },
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "user",
                    as: "orders",
                },
            },
            {
                $addFields: {
                    totalSpent: {
                        $sum: "$orders.total",
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    phone: 1,
                    avatar: 1,
                    totalSpent: 1,
                },
            },
        ]);
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});
exports.getUsers = getUsers;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = req.body;
        const userId = req.user._id;
        // If email is being updated, check if it's already in use
        if (updates.email) {
            const emailExists = yield user_model_1.UserModel.findOne({ email: updates.email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        // If phone is being updated, check if it's already in use
        if (updates.phone) {
            const phoneExists = yield user_model_1.UserModel.findOne({ phone: updates.phone, _id: { $ne: userId } });
            if (phoneExists) {
                return res.status(400).json({ message: 'Phone number already in use' });
            }
        }
        const updatedUser = yield user_model_1.UserModel.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select('-password -adminSettings');
        res.json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;
        const user = yield user_model_1.UserModel.findById(userId);
        const isMatch = yield bcrypt_1.default.compare(currentPassword, user === null || user === void 0 ? void 0 : user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield user_model_1.UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updatePassword = updatePassword;
