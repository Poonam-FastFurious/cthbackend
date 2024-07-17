import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  registerUser,
  updateUser,
} from "./User.controler.js";
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
router.route("/update").patch(updateUser);
router.route("/delete").delete(deleteUser);
export default router;
