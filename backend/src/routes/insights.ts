import { Router } from "express";
import { isAdmin, isAuthenticated } from "../utils/auth.middleware";
import { insight } from "../utils/pipeline";

const inRouter = Router()


inRouter.get("/insights", isAuthenticated, isAdmin, async (req: any, res: any) => {
    console.log(insight)
    res.status(200).json({ insight })
})


export default inRouter