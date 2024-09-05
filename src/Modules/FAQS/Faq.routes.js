import { Router } from "express";
import { addFAQ, deleteFAQ, getAllFAQs } from "./Faqs.controler.js";

const router = Router();

router.route("/add").post(addFAQ);
router.route("/all").get(getAllFAQs);
router.route("/delete").delete(deleteFAQ);

export default router;
