import { Router } from "express";
import { registerUser, logoutUser } from "../controllers/userController.js";
import { upload } from "../middlewwares/multer.middleware.js";
import { verifyJWT } from "../middlewwares/auth.middleware.js";

const router = Router();
// /api/v1/healthcheck/test

router.route("/register").post(upload.fields([
    {name: "avatar", maxCount:1},{name :"coverImage", maxCount:1}
]), registerUser)

// secured Routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;