import express, { Application } from "express";
import mongoose from "mongoose";
import session from 'express-session';
import passport from "./utils/auth.strategy";
import cors from "cors";
import * as dotenv from "dotenv";
import orderRouter from "./routes/order.route";
import http from "http";
import { Server } from "socket.io";
import router from "./routes/auth.route";
import cookieParser from "cookie-parser";
import productRoute from "./routes/product.route";
import cartRoute from "./routes/cart.route";
import walletRouter from "./routes/wallet.route";
import { imageUpload, upload } from "./utils/imageUpload";
import { getInsights } from "./utils/insights";
// import { isAuthenticated } from "./utils/auth.middleware";
// import { Cart } from "./Models/cart.model"; // Ensure all models are imported
import { Product } from "./Models/product.model"; // Ensure all models are imported

dotenv.config(); // Load environment variables from .env

const app: Application = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app); // Ensure server uses express app

const db_connect = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@neema.acaijrr.mongodb.net/?retryWrites=true&w=majority&appName=Neema`;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],},
} as any );

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  name: 'jwt',
  secret: process.env.COOKIE_SECRET as string || 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    path: '/',
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    const message = err.message || 'Unauthorized';
    res.status(401).send(message);
  }
  next();
});

app.use("/api", router);
app.use("/api", productRoute);
app.use("/api", orderRouter);
app.use("/api", cartRoute);
app.use("/api", walletRouter);
app.post("/api/image/upload", upload.array("my_files"), imageUpload);

app.post('/api/getcartwithproducts', async (req, res) => {
  const {cart} = req.body;

  if (!cart) {
    return res.status(400).json({ message: 'Cart not found' });
  }

  const productIds = cart.items.map((item: any) => item.productId);

  const products = await Product.find({ _id: { $in: productIds } }).exec();

  cart.items = cart.items.map((item: any) => {
    const product = products.find(p => p._id.toString() === item.productId.toString());
    return {...item, product };
  });
  res.json(cart);
});

io.on("connection", socket => {
  console.log(`connected: ${socket.id}`);
  socket.on("get_insight_data", async () => {
    const insightData = await getInsights()
    const insights = [
      {
        name: "Orders",
        value: insightData.currentMonthTotalOrders,
        percentage: `${insightData.totalOrderPercentageChange > 0 ? "+" : ""}${insightData.totalOrderPercentageChange}%`,
      },
      {
        name: "Sales",
        value: insightData.currentMonthTotalSale,
        percentage: `${insightData.totalSalePercentageChange > 0 ? "+" : ""}${insightData.totalSalePercentageChange}%`,
      },
      {
        name: "Customers",
        value: insightData.totalUserPercentageChange,
        percentage: `${insightData.totalUserPercentageChange > 0 ? "+" : ""}${insightData.totalUserPercentageChange}%`,
      },
      {
        name: "Products",
        value: insightData.currentMonthTotalProducts,
        percentage: `${insightData.totalProductPercentageChange > 0 ? "+" : ""}${insightData.totalProductPercentageChange}%`,
      }
    ]

    socket.emit("insight_data", insights)
  });

  socket.on("disconnect", () => console.log("User disconnected", socket.id));
});

mongoose.connect(db_connect)
  .then(() => console.log("Connected to MongoDB"))
  .then(() => server.listen(port, () => {
    console.log(`Server running on port ${port} http://localhost:${port}`);
  }))
  .catch(error => console.error("Error connecting to MongoDB:", error));

export default app;
