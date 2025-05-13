import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { HappyCustomer } from "./HappyCustomer.model.js";

const createHappyCustomer = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { videoUrl, Name, heading, details } = req.body;

    if (![videoUrl, Name, heading, details].every((field) => field?.trim())) {
      throw new ApiError(
        400,
        "Video URL, Name, heading, and details are required"
      );
    }

    const imageFilePath = req.files?.photoUrl?.[0]?.path;
    let photoUrl;

    if (imageFilePath) {
      const image = await uploadOnCloudinary(imageFilePath);
      if (!image) {
        throw new ApiError(400, "Failed to upload image");
      }
      photoUrl = image.url;
    }

    const happyCustomer = await HappyCustomer.create({
      videoUrl,
      Name,
      heading,
      details,
      photoUrl,
    });

    const { _id: _, ...createdHappyCustomer } = happyCustomer.toObject();

    return res.status(201).json(
      new ApiResponse(
        200,
        createdHappyCustomer,
        "Happy customer created successfully"
      )
    );
  } catch (error) {
    console.error("Error during happy customer creation:", error);

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

const getAllHappyCustomers = async (req, res) => {
  try {
    // Fetch all happy customer entries from the database
    const happyCustomers = await HappyCustomer.find();

    // If no happy customers are found, return an empty array with a message
    if (!happyCustomers.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No happy customers found"));
    }

    // Return the list of happy customers
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          happyCustomers,
          "Happy customers retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching happy customers:", error);

    // Handle unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const deleteHappyCustomerById = async (req, res) => {
  try {
    const { id } = req.body; // Get the happy customer ID from request parameters

    // Validate the provided ID
    if (!id) {
      throw new ApiError(400, "Happy Customer ID is required");
    }

    // Find and delete the happy customer entry
    const deletedHappyCustomer = await HappyCustomer.findByIdAndDelete(id);

    // If no happy customer is found, return an error
    if (!deletedHappyCustomer) {
      throw new ApiError(404, "Happy Customer not found");
    }

    // Return a success message upon successful deletion
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Happy Customer deleted successfully"));
  } catch (error) {
    console.error("Error deleting happy customer:", error);

    // Handle known errors
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    // Handle unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { createHappyCustomer, getAllHappyCustomers, deleteHappyCustomerById };
