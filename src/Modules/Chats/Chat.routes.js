import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middlwares.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  fetchSingleChat,
  getAllGroupChats,
  getGroupInfo,
  removeFromGroup,
  renameGroup,
} from "./Chat.controler.js";

const router = Router();
router.route("/").post(verifyJWT, accessChat);
router.route("/getsingle").get(verifyJWT, fetchSingleChat);
router.route("/getallchat").get(verifyJWT, fetchChats);
router.route("/getallgroups").get(verifyJWT, getAllGroupChats);
router.route("/groupcreate").post(verifyJWT, createGroupChat);
router.route("/renamegroup").patch(verifyJWT, renameGroup);
router.route("/groupadduser").patch(verifyJWT, addToGroup);
router.route("/groupremoveuser").patch(verifyJWT, removeFromGroup);
router.route("/groupinfo").get(verifyJWT, getGroupInfo);

export default router;
