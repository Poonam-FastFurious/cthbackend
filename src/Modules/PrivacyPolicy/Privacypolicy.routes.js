import { Router } from "express";
import {
  addPrivacyPolicy,
  deletePrivacyPolicy,
  getAllPrivacyPolicies,
} from "./Privacypolicy.controler.js";

const router = Router();
router.route("/add").post(addPrivacyPolicy);
router.route("/").get(getAllPrivacyPolicies);
router.route("/delete").delete(deletePrivacyPolicy);

export default router;
