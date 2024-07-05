import { Router } from "express";
import { isAuthenticated } from "../utils/auth.middleware";
import { addToCart, getCart, removeFromCart } from "../Controllers/cart.controller";

const cartRoute = Router()

cartRoute.post("/addtocart/:productId", isAuthenticated, addToCart )
cartRoute.get("/getcart", isAuthenticated, getCart)
cartRoute.delete("/removefromcart/:id", isAuthenticated, removeFromCart)


export default cartRoute