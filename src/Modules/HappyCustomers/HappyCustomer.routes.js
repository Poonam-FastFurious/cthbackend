import { Router } from "express";
import {
  createHappyCustomer,
  deleteHappyCustomerById,
  getAllHappyCustomers,
} from "./HappyCustomer.controler.js";
import { upload } from "../../middlewares/FileUpload.middlwares.js";

const router = Router();
router.route("/add").post(
  upload.fields([
    {
      name: "photoUrl",
      maxCount: 1,
    },
  ]),
  createHappyCustomer
);
router.route("/").get(getAllHappyCustomers);
router.route("/delete").delete(deleteHappyCustomerById);

export default router;
