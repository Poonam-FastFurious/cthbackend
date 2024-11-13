import { Blog } from "./Blog.modal.js"; // Adjust the import based on your actual file structure
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js"; // Assuming you have this utility function
import { uploadToS3 } from "../../utils/S3Service.js";

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

    let imageUrl = req.body.image; // Default to the provided image URL if any
    let thumbnailUrls = req.body.thumbnail; // Default to the provided thumbnail URLs

    // Upload main image to S3 if it's provided in the request
    if (req.files?.image) {
      const imageFile = req.files.image[0];
      const uploadedImage = await uploadToS3(
        imageFile.buffer,
        imageFile.originalname
      );
      if (!uploadedImage || !uploadedImage.Location) {
        throw new Error("Failed to upload main image to AWS S3");
      }
      imageUrl = uploadedImage.Location;
    }

    // Upload thumbnail images to S3 if they are provided in the request
    if (req.files?.thumbnail) {
      thumbnailUrls = await Promise.all(
        req.files.thumbnail.map(async (file) => {
          const uploadedThumbnail = await uploadToS3(
            file.buffer,
            file.originalname
          );
          if (!uploadedThumbnail || !uploadedThumbnail.Location) {
            throw new Error("Failed to upload a thumbnail image to AWS S3");
          }
          return uploadedThumbnail.Location;
        })
      );
    } else if (typeof thumbnailUrls === "string") {
      thumbnailUrls = [thumbnailUrls]; // Ensure it's an array if only a single URL is provided
    }

    // Prepare the blog post data
    const blogPostData = {
      image: imageUrl,
      title,
      description,
      content,
      thumbnail: thumbnailUrls, // Array of S3 URLs for thumbnails
      tags: tags.split(","), // Assuming tags are provided as a comma-separated string
      category,
      author,
    };

    // Create and save the blog post
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
    const { id } = req.body;
    const { title, description, content, tags, category, author } = req.body;

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

    let updatedThumbnail = existingBlogPost.thumbnail;
    let updatedImage = existingBlogPost.image;

    // Upload multiple thumbnails to S3 if provided in the request
    if (req.files?.thumbnail) {
      updatedThumbnail = await Promise.all(
        req.files.thumbnail.map(async (file) => {
          const uploadedThumbnail = await uploadToS3(
            file.buffer,
            file.originalname
          );
          return uploadedThumbnail.Location;
        })
      );
    }

    // Upload main image to S3 if provided in the request
    if (req.files?.image) {
      const imageFile = req.files.image[0];
      const uploadedImage = await uploadToS3(
        imageFile.buffer,
        imageFile.originalname
      );
      updatedImage = uploadedImage.Location;
    }

    // Prepare updated blog data
    const updatedBlogPostData = {
      title,
      description,
      content,
      thumbnail: updatedThumbnail,
      image: updatedImage,
      tags: tags ? tags.split(",") : existingBlogPost.tags,
      category,
      author,
    };

    // Update blog post
    const updatedBlogPost = await Blog.findByIdAndUpdate(
      id,
      updatedBlogPostData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedBlogPost,
      message: "Blog post updated successfully",
    });
  } catch (err) {
    if (err instanceof ApiError) {
      ApiError.handleError(err, res);
    } else {
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
const markBlogAsRead = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // Assuming ID is passed as a URL parameter

    if (!id) {
      throw new ApiError(400, "Blog ID is required");
    }

    // Fetch the blog post by ID
    const blogPost = await Blog.findById(id);

    if (!blogPost) {
      throw new ApiError(404, "Blog post not found");
    }

    // Increment the views count
    blogPost.views += 1;
    await blogPost.save();

    return res.status(200).json({
      success: true,
      data: blogPost,
      message: "Blog marked as read",
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
const addComment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query; // Assuming ID is passed as a URL parameter
    const { comment } = req.body;

    if (!id) {
      throw new ApiError(400, "Blog ID is required");
    }

    if (!comment) {
      throw new ApiError(400, "Comment is required");
    }

    // Fetch the blog post by ID
    const blogPost = await Blog.findById(id);

    if (!blogPost) {
      throw new ApiError(404, "Blog post not found");
    }

    // Add the comment
    blogPost.comments.push({
      comment,
      replies: [],
    });

    await blogPost.save();

    return res.status(200).json({
      success: true,
      data: blogPost,
      message: "Comment added successfully",
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

export {
  createBlogPost,
  getAllBlogs,
  deleteBlog,
  editBlog,
  getSingleBlog,
  markBlogAsRead,
  addComment,
};
