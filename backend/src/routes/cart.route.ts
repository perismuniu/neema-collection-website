import { Router } from "express";
import { isAuthenticated } from "../utils/auth.middleware";
import { addToCart, getCart, removeFromCart, handleQuantityChange } from "../Controllers/cart.controller";

const cartRoute = Router();

cartRoute.post("/addtocart/:productId", isAuthenticated, addToCart);
cartRoute.get("/getcart", isAuthenticated, getCart);
cartRoute.delete("/removefromcart/:itemId", isAuthenticated, removeFromCart);
cartRoute.put("/updatequantity", isAuthenticated, handleQuantityChange);

export default cartRoute;
