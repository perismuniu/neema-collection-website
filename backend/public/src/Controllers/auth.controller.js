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
exports.verifyToken = exports.dashboard = exports.logout = exports.login = exports.register = void 0;
const bcrypt = __importStar(require("bcrypt"));
const user_model_1 = require("../Models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const auth_strategy_1 = __importDefault(require("../utils/auth.strategy"));
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get user input
    const { email, password, username } = req.body;
    console.log(req.body);
    // check if all fields are filled and passes validation
    if (!email || !password || !username) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    // check if name only conatins letters and sapces, password length greater than 6, email is valid and phone number is valid
    if (!/^[a-zA-Z\s]*$/.test(username) ||
        password.length < 6 ||
        !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email) /* || !/^\d{10}$/.test(phone)*/) {
        return res.status(400).json({ message: "Invalid input" });
    }
    // check if user exist in the database
    const user = yield user_model_1.UserModel.findOne({ email: email });
    if (user) {
        return res.status(400).json({ message: "User already exist" });
    }
    //hash password with bcrypt
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(password, salt);
    // create new user
    const newUser = new user_model_1.UserModel(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
    if (email === process.env.ADMIN_EMAIL) {
        newUser.isAdmin = true;
    }
    try {
        // save user in the database
        yield newUser.save();
        // create token
        const token = jsonwebtoken_1.default.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
        req.session.jwt = token;
        // return success message
        return res
            .status(201)
            .json({
            message: `User ${username} registered successfully`,
            isAdmin: newUser.isAdmin,
            token: token,
        });
    }
    catch (error) {
        return res.status(401).json({ message: error.message });
    }
});
exports.register = register;
const login = (req, res) => {
    console.log(req.body);
    auth_strategy_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Error authenticating user", error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: info.message || 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "Error logging in", error: err.message });
            }
            const token = jsonwebtoken_1.default.sign({ sub: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            // Remove sensitive information from user data
            const userData = Object.assign(Object.assign({}, user.toObject()), { password: undefined, __v: undefined });
            return res.status(200).json({
                message: `User ${user.username} logged in successfully`,
                token,
                isAdmin: user.isAdmin,
                user: userData
            });
        });
    })(req, res);
};
exports.login = login;
const logout = (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: "Error logging out" });
            }
            req.session = null;
            res.status(200).json({ message: "Logged out successfully" });
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: "An error occurred during logout" });
    }
};
exports.logout = logout;
// Dashboard
const dashboard = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: `Welcome, ${req.user.username}!` });
};
exports.dashboard = dashboard;
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        return res.status(200).json({
            user: Object.assign(Object.assign({}, user.toObject()), { password: undefined, __v: undefined })
        });
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});
exports.verifyToken = verifyToken;
