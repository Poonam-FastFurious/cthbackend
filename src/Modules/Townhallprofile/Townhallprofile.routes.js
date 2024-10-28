import { Router } from "express";
import {
  getAllTownhallProfiles,
  getTownhallProfileByUserId,
  updateProfile,
  updateProfilePrivacy,
} from "./Townhallprofile.controler.js";

const router = Router();

router.route("/townhallprofile").get(getAllTownhallProfiles);
router.route("/townhall").get(getTownhallProfileByUserId);
router.route("/Update").patch(updateProfile);
router.route("/privacy").post(updateProfilePrivacy);

export default router;
