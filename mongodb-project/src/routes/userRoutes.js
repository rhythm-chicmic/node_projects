import { Router } from "express";
import { registerUser, logoutUser, loginUser, refershAccessToken, changeCurrentPassword, getCurrentUser, getUserChannelProfile, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getWatchHistory } from "../controllers/userController.js";
import { upload } from "../middlewwares/multer.middleware.js";
import { verifyJWT } from "../middlewwares/auth.middleware.js";

const router = Router();
// /api/v1/healthcheck/test

router.route("/register").post(upload.fields([
    {name: "avatar", maxCount:1},{name :"coverImage", maxCount:1}
]), registerUser)

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refershAccessToken)


// secured Routes
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT,upload.single("avatar") ,updateUserAvatar);
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage") ,updateUserCoverImage);
router.route("/history").get(verifyJWT,getWatchHistory);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;