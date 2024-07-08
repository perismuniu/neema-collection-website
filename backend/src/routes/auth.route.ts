import { Request, Response, Router } from "express";
import { dashboard, login, logout, register } from "../Controllers/auth.controller";
import { isAdmin, isAuthenticated } from "../utils/auth.middleware";
import passport from "../utils/auth.strategy";
const router = Router();

router.post("/auth/register", register)
router.post('/auth/login', login)
router.get('/auth/logout', logout)
router.get('/auth/profile', isAuthenticated ,dashboard)
// Google OAuth routes
// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/dashboard'); // Redirect to your desired route after successful login
//   }
// );
router.get("/auth", isAuthenticated, (req: any, res: Response) => {
    const { wallet } = req.user
    if(req.user.isAdmin){
        return res.status(200).json({isAdmin: true, isAuthenticated: true})
    }

    res.status(200).json({isAdmin: false, isAuthenticated: true, wallet})
})

export default router