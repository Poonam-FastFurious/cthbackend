import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "./User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    contactNumber,
    emailAddress,
    linkedinProfile,
    address,
    skills,
    academicProjects,
    honoursAndCertifications,
  } = req.body;

  // Validate required fields
  if (
    [
      firstName,
      lastName,
      contactNumber,
      emailAddress,
      linkedinProfile,
      address,
      skills,
      ,
      honoursAndCertifications,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(
      400,
      "First Name, Last Name, Contact Number, Email Address, and all field are required"
    );
  }

  // Check if user already exists (by username or email)
  const existedUser = await User.findOne({
    $or: [{ username: `CTHUSER${firstName}` }, { emailAddress }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with the same username or email already exists"
    );
  }

  // Create username
  const username = `CTHUSER${firstName}`;

  // Create user object
  //   const hashedOTP = await bcrypt.hash(OTP, 10);
  const user = await User.create({
    firstName,
    lastName,
    username,
    contactNumber,
    emailAddress,
    linkedinProfile,
    address,
    skills,
    academicProjects,
    honoursAndCertifications,
    OTP: "123456",
  });

  // Fetch created user without password and refreshToken fields
  const createdUser = await User.findById(user._id).select(" -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  const { username, emailAddress, OTP } = req.body;

  if (!username && !emailAddress) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { emailAddress }] });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Log password and user for debugging
  console.log("OTP:", OTP);
  console.log("User:", user);

  const isPasswordValid = await user.isOTPCorrect(OTP);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(" -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-OTP -refreshToken");

  if (!users) {
    throw new ApiError(404, "No users found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});
export { registerUser, loginUser, getAllUsers };
