import { Router } from "express";

import {
  addtermscondition,
  deleteTermsCondition,
  getAllTermsConditions,
} from "./termscondition.controler.js";

const router = Router();
router.route("/add").post(addtermscondition);
router.route("/").get(getAllTermsConditions);
router.route("/delete").delete(deleteTermsCondition);

export default router;
