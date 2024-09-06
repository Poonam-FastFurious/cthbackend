import { Router } from "express";
import { addFAQ, deleteFAQ, getAllFAQs, updateFAQ } from "./Faqs.controler.js";

const router = Router();

router.route("/add").post(addFAQ);
router.route("/all").get(getAllFAQs);
router.route("/delete").delete(deleteFAQ);
router.route("/update").patch(updateFAQ);

export default router;
