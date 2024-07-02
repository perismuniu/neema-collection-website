import { Request, Response, Router } from "express";
import { dashboard, login, logout, register } from "../Controllers/auth.controller";
import { isAdmin, isAuthenticated } from "../utils/auth.middleware";
const router = Router();

router.post("/auth/register", register)
router.post('/auth/login', login)
router.get('/auth/logout', isAuthenticated, logout)
router.get('/auth/profile', isAuthenticated ,dashboard)
router.get("/auth", isAuthenticated, (req: any, res: Response) => {
    const { wallet } = req.user
    if(req.user.isAdmin){
        return res.status(200).json({isAdmin: true, isAuthenticated: true})
    }

    res.status(200).json({isAdmin: false, isAuthenticated: true, wallet})
})

export default router