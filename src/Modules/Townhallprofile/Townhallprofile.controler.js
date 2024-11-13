import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../CTHUser/User.model.js";
import { TownhallProfile } from "./Townhallprofile.model.js";
import mongoose from "mongoose";
export const getAllTownhallProfiles = asyncHandler(async (req, res) => {
  const profiles = await TownhallProfile.find({}).populate(
    "userId",
    "username email"
  ); // Optionally populate userId if needed

  if (!profiles || profiles.length === 0) {
    throw new ApiError(404, "No town hall profiles found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        profiles,
        "All town hall profiles fetched successfully"
      )
    );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    userId, // Ensure userId is in the request body
    displayName,
    skill,
    linkedinProfile,
    honoursAndCertifications,
    gender,
    email,
    about,
    firstName,
    lastName,
  } = req.body;

  // Validate user ID
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Fetch the profile to ensure it exists
  const profile = await TownhallProfile.findOne({ userId });
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  // Function to build update data dynamically
  const buildUpdateData = (data) => {
    return Object.keys(data).reduce((acc, key) => {
      if (data[key] !== undefined) acc[key] = data[key];
      return acc;
    }, {});
  };

  // Prepare update data for TownhallProfile
  const updateProfileData = buildUpdateData({
    displayName,
    skill,
    linkedinProfile,
    email,
    gender,
    honoursAndCertifications,
    about,
  });

  // Update the TownhallProfile
  const updatedProfile = await TownhallProfile.findOneAndUpdate(
    { userId },
    updateProfileData,
    { new: true, runValidators: true }
  );

  if (!updatedProfile) {
    throw new ApiError(500, "Something went wrong while updating the profile");
  }

  // Prepare update data for User
  const updateUserData = buildUpdateData({
    firstName,
    lastName,
    displayName,
    gender,
    linkedinProfile,
    honoursAndCertifications,
  });

  // Update the User model
  const updatedUser = await User.findByIdAndUpdate(userId, updateUserData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating the user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedProfile, updatedUser },
        "Profile and User updated successfully"
      )
    );
});

export const updateProfilePrivacy = asyncHandler(async (req, res) => {
  const { userId, isPublic } = req.body; // Get userId and isPublic from request body

  // Validate user ID
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Validate isPublic
  if (typeof isPublic !== "boolean") {
    throw new ApiError(400, "isPublic must be a boolean value");
  }

  // Fetch the profile to ensure it exists
  const profile = await TownhallProfile.findOne({ userId });
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  // Update the profile privacy
  profile.isPublic = isPublic; // Set the isPublic field

  // Save the updated profile
  const updatedProfile = await profile.save();

  if (!updatedProfile) {
    throw new ApiError(
      500,
      "Something went wrong while updating the profile privacy"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProfile,
        "Profile privacy updated successfully"
      )
    );
});

export const getTownhallProfileByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.query; // Extract userId from request parameters

  // Find the town hall profile by userId
  const profile = await TownhallProfile.findOne({ userId }).populate(
    "userId",
    "username emailAddress firstName lastName displayName contactNumber linkedinProfile address skills AccountStatus gender honoursAndCertifications IsApproved profilePhoto Active"
  );

  if (!profile) {
    throw new ApiError(404, "Town hall profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, profile, "Town hall profile fetched successfully")
    );
});
