import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { FAQ } from "./Faqs.modal.js";

// Controller function to add a new FAQ
const addFAQ = asyncHandler(async (req, res) => {
  try {
    // Get FAQ details from the request body
    const { question, answer } = req.body;

    // Validation - Check if required fields are not empty
    if (!question || !answer) {
      throw new ApiError(400, "Question and answer are required");
    }

    // Check if FAQ with the same question already exists
    const existingFAQ = await FAQ.findOne({ question });

    if (existingFAQ) {
      throw new ApiError(409, "FAQ with this question already exists");
    }

    // Create the FAQ object
    const newFAQ = await FAQ.create({ question, answer });

    // Check for FAQ creation
    if (!newFAQ) {
      throw new ApiError(500, "Something went wrong while creating the FAQ");
    }

    return res.status(201).json({
      success: true,
      data: newFAQ,
      message: "FAQ created successfully",
    });
  } catch (error) {
    // Handle errors using ApiError's handleError method
    if (error instanceof ApiError) {
      return ApiError.handleError(error, res);
    } else {
      // For unexpected errors, use a generic internal server error response
      const apiError = new ApiError(
        500,
        "Internal server error",
        [],
        error.stack
      );
      return ApiError.handleError(apiError, res);
    }
  }
});
const getAllFAQs = asyncHandler(async (req, res) => {
  try {
    // Fetch all FAQs from the database
    const faqs = await FAQ.find();

    // Check if any FAQs were found
    if (!faqs || faqs.length === 0) {
      throw new ApiError(404, "No FAQs found");
    }

    return res.status(200).json({
      success: true,
      data: faqs,
      message: "FAQs retrieved successfully",
    });
  } catch (error) {
    // Handle errors using ApiError's handleError method
    if (error instanceof ApiError) {
      return ApiError.handleError(error, res);
    } else {
      // For unexpected errors, use a generic internal server error response
      const apiError = new ApiError(
        500,
        "Internal server error",
        [],
        error.stack
      );
      return ApiError.handleError(apiError, res);
    }
  }
});
const deleteFAQ = asyncHandler(async (req, res) => {
  try {
    // Get FAQ ID from request parameters
    const { id } = req.body;

    // Validate the ID
    if (!id) {
      throw new ApiError(400, "FAQ ID is required");
    }

    // Find and delete the FAQ by ID
    const deletedFAQ = await FAQ.findByIdAndDelete(id);

    // Check if the FAQ was found and deleted
    if (!deletedFAQ) {
      throw new ApiError(404, "FAQ not found");
    }

    return res.status(200).json({
      success: true,
      data: deletedFAQ,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    // Handle errors using ApiError's handleError method
    if (error instanceof ApiError) {
      return ApiError.handleError(error, res);
    } else {
      // For unexpected errors, use a generic internal server error response
      const apiError = new ApiError(
        500,
        "Internal server error",
        [],
        error.stack
      );
      return ApiError.handleError(apiError, res);
    }
  }
});
const updateFAQ = asyncHandler(async (req, res) => {
  try {
    // Get the FAQ ID and the updated question and answer from the request
    const { id } = req.body;
    const { question, answer } = req.body;

    // Validation - Check if ID and required fields are provided
    if (!id) {
      throw new ApiError(400, "FAQ ID is required");
    }
    if (!question || !answer) {
      throw new ApiError(400, "Question and answer are required");
    }

    // Find the FAQ by ID
    const faq = await FAQ.findById(id);

    // Check if the FAQ exists
    if (!faq) {
      throw new ApiError(404, "FAQ not found");
    }

    // Update the FAQ with the new details
    faq.question = question;
    faq.answer = answer;

    // Save the updated FAQ
    const updatedFAQ = await faq.save();

    return res.status(200).json({
      success: true,
      data: updatedFAQ,
      message: "FAQ updated successfully",
    });
  } catch (error) {
    // Handle errors using ApiError's handleError method
    if (error instanceof ApiError) {
      return ApiError.handleError(error, res);
    } else {
      // For unexpected errors, use a generic internal server error response
      const apiError = new ApiError(
        500,
        "Internal server error",
        [],
        error.stack
      );
      return ApiError.handleError(apiError, res);
    }
  }
});

export { addFAQ, getAllFAQs, deleteFAQ, updateFAQ };
