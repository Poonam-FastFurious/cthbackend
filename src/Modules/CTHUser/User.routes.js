import { Router } from "express";
import { getAllUsers, loginUser, registerUser } from "./User.controler.js";
import { upload } from "../../middlewares/FileUpload.middlwares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/alluser").get(getAllUsers);
export default router;
