import { Router } from "express";
import {
  addAssociateMember,
  deleteAssociateMember,
  editAssociateMember,
  getAllAssociateMembers,
} from "./Associate.controler.js";

const router = Router();

router.route("/add").post(addAssociateMember);
router.route("/edit").patch(editAssociateMember);
router.route("/delete").delete(deleteAssociateMember);
router.route("/all").get(getAllAssociateMembers);

export default router;
