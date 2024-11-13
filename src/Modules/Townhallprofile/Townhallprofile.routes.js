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
router.route("/Update").put(updateProfile);
router.route("/privacy").patch(updateProfilePrivacy);

export default router;
