import { Router } from "express";

import {
  createBlogPost,
  deleteBlog,
  editBlog,
  getAllBlogs,
  getSingleBlog,
} from "./Blog.controler.js";
import { upload } from "../../middlewares/FileUpload.middlwares.js";

const router = Router();

// Route to add a new blog post
router.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 }, // Assuming single thumbnail upload
    { name: "thumbnail", maxCount: 10 }, // Assuming multiple gallery images upload
  ]),
  createBlogPost
);
router.get("/allblogs", getAllBlogs);
router.get("/singleblogs", getSingleBlog);
router.route("/delete").delete(deleteBlog);
router.patch(
  "/edit",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 10 },
  ]),
  editBlog
);

export default router;
