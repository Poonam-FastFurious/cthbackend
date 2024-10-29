import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { VideoTestimonial } from "./Videotestimonial.model.js";

export const createVideoTestimonial = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { videoUrl, heading, details } = req.body;

    if (![videoUrl, heading, details].every((field) => field?.trim())) {
      throw new ApiError(400, "Video URL, heading, and details are required");
    }

    // Check if the video URL is a valid YouTube link
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
      throw new ApiError(400, "Invalid YouTube URL");
    }

    const videoTestimonial = await VideoTestimonial.create({
      videoUrl,
      heading,
      details,
    });

    const { _id: _, ...createdVideoTestimonial } = videoTestimonial.toObject();

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdVideoTestimonial,
          "Video testimonial created successfully"
        )
      );
  } catch (error) {
    console.error("Error during video testimonial creation:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllVideoTestimonials = async (req, res) => {
  try {
    const videoTestimonials = await VideoTestimonial.find().sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          videoTestimonials,
          "Video testimonials retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching video testimonials:", error);

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const deleteVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new ApiError(400, "Testimonial ID is required");
    }

    const deletedTestimonial = await VideoTestimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      throw new ApiError(404, "Video testimonial not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Video testimonial deleted successfully")
      );
  } catch (error) {
    console.error("Error during video testimonial deletion:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
