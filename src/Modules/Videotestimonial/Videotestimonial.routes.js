import { Router } from "express";
import {
  createVideoTestimonial,
  deleteVideoTestimonial,
  getAllVideoTestimonials,
} from "./Videotestimonial.controler.js";
const router = Router();
router.route("/add").post(createVideoTestimonial);
router.route("/").get(getAllVideoTestimonials);
router.route("/delete").delete(deleteVideoTestimonial);
export default router;
