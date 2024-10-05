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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const auth_strategy_1 = __importDefault(require("./utils/auth.strategy"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const imageUpload_1 = require("./utils/imageUpload");
const insights_1 = require("./utils/insights");
const morgan_1 = __importDefault(require("morgan"));
const stats_route_1 = __importDefault(require("./routes/stats.route"));
const mpesa_route_1 = require("./routes/mpesa.route");
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const notification_1 = require("./utils/notification");
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3002;
const server = http_1.default.createServer(app);
app.use((0, morgan_1.default)('dev'));
// Move this connection string to .env file
const db_connect = `mongodb+srv://PerisNeemaCollection:${process.env.DB_PASSWORD}@neema.acaijrr.mongodb.net/?retryWrites=true&w=majority&appName=Neema`;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});
// Setup notification handlers
(0, notification_1.setupNotificationHandlers)(io);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (origin === "http://localhost:5173") {
            callback(null, origin);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin"],
    credentials: true
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
    }
}));
app.use(auth_strategy_1.default.initialize());
app.use(auth_strategy_1.default.session());
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Routes
app.use("/api", auth_route_1.default);
app.use("/api", product_route_1.default);
app.use("/api", order_route_1.default);
app.use("/api", cart_route_1.default);
app.post("/api/image/upload", imageUpload_1.upload.array("my_files"), imageUpload_1.imageUpload);
app.post("/api/image/cleanup", imageUpload_1.cleanupImages);
app.use("/api/dashboard", stats_route_1.default);
app.use('/api/notifications', notification_route_1.default);
app.use('/api', user_route_1.default);
app.post('/api/contact/whatsapp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, notification_1.emitNotification)({
            type: notification_1.NotificationTypes.WHATSAPP_CONTACT,
            title: 'New WhatsApp Contact Request',
            content: `${req.body.name} wants to contact you via WhatsApp`,
            soundType: 'message',
            contactData: {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                message: req.body.message
            }
        });
        res.status(200).json({ message: 'Notification sent successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending notification' });
    }
}));
app.post('/api/contact/email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, notification_1.emitNotification)({
            type: notification_1.NotificationTypes.EMAIL_CONTACT,
            title: 'New Email Contact Request',
            content: `${req.body.name} wants to contact you via email`,
            soundType: 'message',
            contactData: {
                name: req.body.name,
                email: req.body.email,
                message: req.body.message
            }
        });
        res.status(200).json({ message: 'Notification sent successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending notification' });
    }
}));
// Google OAuth routes
app.get('/auth/google', auth_strategy_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', auth_strategy_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('http://localhost:5173');
});
(0, mpesa_route_1.initMpesaRoutes)(app);
mongoose_1.default.connect(db_connect)
    .then(() => console.log("Connected to MongoDB"))
    .then(() => server.listen(port, () => {
    console.log(`Server running on port ${port} http://localhost:${port}`);
}))
    .catch(error => console.error("Error connecting to MongoDB:", error));
exports.default = app;
io.on("connection", socket => {
    console.log(`connected: ${socket.id}`);
    socket.on("get_insight_data", () => __awaiter(void 0, void 0, void 0, function* () {
        const insightData = yield (0, insights_1.getInsights)();
        socket.emit("insight_data");
    }));
    socket.on("disconnect", () => console.log("User disconnected", socket.id));
});
