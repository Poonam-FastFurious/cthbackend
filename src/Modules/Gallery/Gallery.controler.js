import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadToS3 } from "../../utils/S3Service.js";
import { Gallery } from "./Gallery.model.js"; // Import your Gallery model

const uploadGalleryImage = asyncHandler(async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { title, status } = req.body;

    if (![title, status].every((field) => field?.trim())) {
      throw new ApiError(400, "All fields are required");
    }

    const imageFile = req.files?.image?.[0];
    if (!imageFile) {
      throw new ApiError(400, "Image file is required");
    }

    // Upload image to S3
    const uploadedImage = await uploadToS3(
      imageFile.buffer,
      imageFile.originalname
    );
    if (!uploadedImage) {
      throw new ApiError(500, "Failed to upload image to S3");
    }

    // Create new gallery item with S3 image URL
    const galleryItem = await Gallery.create({
      image: uploadedImage.Location, // S3 image URL
      title,
      status,
    });

    return res.status(201).json({
      success: true,
      data: galleryItem,
      message: "Image uploaded to gallery successfully",
    });
  } catch (error) {
    console.error("Error during gallery image upload:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

const getAllGalleryImages = asyncHandler(async (req, res) => {
  try {
    const galleryImages = await Gallery.find(); // Fetch all gallery images

    return res.status(200).json({
      success: true,
      data: galleryImages,
      message: "Gallery images retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving gallery images:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
const deleteGalleryImage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // Assuming id is passed in the request body

    console.log("Deleting gallery image with ID:", id);

    // Find the gallery image by id and delete it
    const deletedGalleryImage = await Gallery.findByIdAndDelete(id);

    if (!deletedGalleryImage) {
      console.log("Gallery image not found with ID:", id);
      return res
        .status(404)
        .json({ success: false, message: "Gallery image not found" });
    }

    console.log("Gallery image deleted successfully with ID:", id);

    return res.json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Error during gallery image deletion:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
const editGalleryImage = asyncHandler(async (req, res) => {
  try {
    const { id, title, status } = req.body;

    // Check if gallery image exists
    const galleryImage = await Gallery.findById(id);
    if (!galleryImage) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery image not found" });
    }

    // Update title and status if provided
    if (title) galleryImage.title = title;
    if (status) galleryImage.status = status;

    // If a new image is provided, upload it to S3
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      const uploadedImage = await uploadToS3(
        imageFile.buffer,
        imageFile.originalname
      );
      if (!uploadedImage) {
        throw new Error("Failed to upload image to S3");
      }
      // Update the image URL in the gallery document
      galleryImage.image = uploadedImage.Location; // S3 image URL
    }

    // Save the updated gallery item
    await galleryImage.save();

    return res.json({
      success: true,
      data: galleryImage,
      message: "Gallery image updated successfully",
    });
  } catch (error) {
    console.error("Error during gallery image edit:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export {
  uploadGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
  editGalleryImage,
};
