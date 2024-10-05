"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchema = void 0;
// src\Model\user.model.ts
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.UserSchema = new mongoose_2.Schema({
    username: {
        type: String,
        required: true,
        match: /^[a-zA-Z\s]*$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    orders: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Order"
        }],
    phone: { type: String },
    deliveryType: { type: String },
    address: { type: String },
    adminSettings: {
        showInactiveProducts: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
        twoFactorAuth: { type: Boolean, default: false }
    }
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model("User", exports.UserSchema);
