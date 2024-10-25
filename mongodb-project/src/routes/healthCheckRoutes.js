import { Router } from "express";
import { healthCheck } from "../controllers/healthCheckController.js";
import { upload } from "../middlewwares/multer.middleware.js";

const router = Router();
// /api/v1/healthcheck/test

router.route("/").get(healthCheck)
router.route("/test").get(healthCheck)


export default router;