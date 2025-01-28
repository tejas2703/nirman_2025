import { Router } from "express";
import { addFoodItem, getFoodItems, loginUser } from "../controllers/user.controller.js";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser)

router.route("/getFoodItems").get(verifyUserJWT, getFoodItems)

router.route("/addFoodItem").post(verifyUserJWT, addFoodItem)


export default router;