import { Blog } from "./Blog.modal.js"; // Adjust the import based on your actual file structure
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js"; // Assuming you have this utility function

const createBlogPost = asyncHandler(async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { title, description, content, tags, category, author } = req.body;

    if (
      ![title, description, content, category, author].every((field) =>
        field?.trim()
      )
    ) {
      throw new ApiError(
        400,
        "Title, description, content, category, and author are required fields"
      );
    }

    let thumbnailUrl = req.body.thumbnail; // Default to the provided thumbnail URL
    let imageUrl = req.body.image; // Default to the provided image URL

    // Upload thumbnail image to Cloudinary if a local file path is provided
    if (req.files?.thumbnail) {
      const thumbnailLocalPath = req.files.thumbnail[0].path;
      const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
      thumbnailUrl = uploadedThumbnail.url;
    }

    // Upload main image to Cloudinary if a local file path is provided
    if (req.files?.image) {
      const imageLocalPath = req.files.image[0].path;
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      imageUrl = uploadedImage.url;
    }

    const blogPostData = {
      image: imageUrl,
      title,
      description,
      content,
      thumbnail: thumbnailUrl,
      tags: tags.split(","), // Assuming tags are provided as a comma-separated string
      category,
      author, // Assuming author details are provided as a JSON string
    };

    const blogPost = await Blog.create(blogPostData);

    return res.status(201).json({
      success: true,
      data: blogPost,
      message: "Blog post created successfully",
    });
  } catch (err) {
    // Handle any errors
    if (err instanceof ApiError) {
      ApiError.handleError(err, res);
    } else {
      // Handle unexpected errors
      const apiError = new ApiError(500, "An unexpected error occurred", [
        err.message,
      ]);
      ApiError.handleError(apiError, res);
    }
  }
});
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all blog posts from the database

    if (!blogs.length) {
      throw new ApiError(404, "No blog posts found");
    }

    return res.status(200).json({
      success: true,
      data: blogs,
      message: "Blog posts retrieved successfully",
    });
  } catch (err) {
    // Handle any errors
    if (err instanceof ApiError) {
      ApiError.handleError(err, res);
    } else {
      // Handle unexpected errors
      const apiError = new ApiError(500, "An unexpected error occurred", [
        err.message,
      ]);
      ApiError.handleError(apiError, res);
    }
  }
});
const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // Assuming ID is passed as a URL parameter

    if (!id) {
      throw new ApiError(400, "Blog ID is required");
    }

    // Find and delete the blog post by ID
    const blogPost = await Blog.findByIdAndDelete(id);

    if (!blogPost) {
      throw new ApiError(404, "Blog post not found");
    }

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (err) {
    // Handle any errors
    if (err instanceof ApiError) {
      ApiError.handleError(err, res);
    } else {
      // Handle unexpected errors
      const apiError = new ApiError(500, "An unexpected error occurred", [
        err.message,
      ]);
      ApiError.handleError(apiError, res);
    }
  }
});
const editBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // Assuming ID is passed as a URL parameter
    const {
      title,
      description,
      content,
      tags,
      category,
      author,
      thumbnail,
      image,
    } = req.body;

    if (!id) {
      throw new ApiError(400, "Blog ID is required");
    }

    if (
      ![title, description, content, category, author].every((field) =>
        field?.trim()
      )
    ) {
      throw new ApiError(
        400,
        "Title, description, content, category, and author are required fields"
      );
    }

    // Fetch the existing blog post
    const existingBlogPost = await Blog.findById(id);

    if (!existingBlogPost) {
      throw new ApiError(404, "Blog post not found");
    }

    let updatedThumbnail = thumbnail; // Default to the provided thumbnail URL
    let updatedImage = image; // Default to the provided image URL

    // Upload thumbnail image to Cloudinary if a local file path is provided
    if (req.files?.thumbnail) {
      const thumbnailLocalPath = req.files.thumbnail[0].path;
      const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
      updatedThumbnail = uploadedThumbnail.url;
    }

    // Upload main image to Cloudinary if a local file path is provided
    if (req.files?.image) {
      const imageLocalPath = req.files.image[0].path;
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      updatedImage = uploadedImage.url;
    }

    // Update blog post data
    const updatedBlogPost = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        description,
        content,
        thumbnail: updatedThumbnail,
        image: updatedImage,
        tags: tags ? tags.split(",") : existingBlogPost.tags, // Update tags if provided
        category,
        author,
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      data: updatedBlogPost,
      message: "Blog post updated successfully",
    });
  } catch (err) {
    // Handle any errors
    if (err instanceof ApiError) {
      ApiError.handleError(err, res);
    } else {
      // Handle unexpected errors
      const apiError = new ApiError(500, "An unexpected error occurred", [
        err.message,
      ]);
      ApiError.handleError(apiError, res);
    }
  }
});
const getSingleBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query; // Assuming ID is passed as a URL parameter

    if (!id) {
      throw new ApiError(400, "Blog ID is required");
    }

    // Fetch the blog post by ID
    const blogPost = await Blog.findById(id);

    if (!blogPost) {
      throw new ApiError(404, "Blog post not found");
    }

    return res.status(200).json({
      success: true,
      data: blogPost,
      message: "Blog post retrieved successfully",
    });
  } catch (err) {
    // Handle any errors
    if (err instanceof ApiError) {
      ApiError.handleError(err, res);
    } else {
      // Handle unexpected errors
      const apiError = new ApiError(500, "An unexpected error occurred", [
        err.message,
      ]);
      ApiError.handleError(apiError, res);
    }
  }
});

export { createBlogPost, getAllBlogs, deleteBlog, editBlog, getSingleBlog };
