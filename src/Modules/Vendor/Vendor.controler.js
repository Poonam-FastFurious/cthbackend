import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";

import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Vendor } from "./vendor.model.js";
import { ApiError } from "../../utils/ApiError.js";

// const generateAccessAndRefereshTokens = async (vendorId) => {
//   try {
//     const vendor = await Vendor.findById(vendorId);
//     if (!vendor) {
//       throw new ApiError(404, "Vendor not found");
//     }
//     const accessToken = vendor.generateAccessToken();
//     const refreshToken = vendor.generateRefreshToken();

//     vendor.refreshToken = refreshToken;
//     await vendor.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.error("Error generating tokens:", error);
//     throw new ApiError(
//       500,
//       "Something went wrong while generating referesh and access token"
//     );
//   }
// };

const registerVendor = asyncHandler(async (req, res) => {
  // get vendor details from frontend
  // validation - not empty
  // check if vendor already exists: vendorname, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create vendor object - create entry in db
  // remove password and refresh token field from response
  // check for vendor creation
  // return res

  const { firstName, storeLegalName, PANNumber,MobileNumber } = req.body;
  //console.log("email: ", email);

  if ([firstName, storeLegalName, PANNumber,MobileNumber].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedVendor = await Vendor.findOne({
    $or: [{ storeLegalName }, { storeName }],
  });

  if (existedVendor) {
    throw new ApiError(409, "vendorname already exists");
  }
  //console.log(req.files);

  // const avatarLocalPath = req.files?.avatar[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  const vendor = await Vendor.create({
    firstName, 
    storeLegalName, 
    PANNumber,
    MobileNumber
  });

  const createdVendor = await Vendor.findById(vendor._id).select(
    "-password -refreshToken"
  );

  if (!createdVendor) {
    throw new ApiError(500, "Something went wrong while registering the vendor");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdVendor, "Vendor registered Successfully"));
});

// const loginVendor = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email) {
//     throw new ApiError(400, "vendorname or email is required");
//   }

//   const vendor = await Vendor.findOne({ email });

//   if (!vendor) {
//     throw new ApiError(404, "Vendor does not exist");
//   }

//   const isPasswordValid = await vendor.isPasswordCorrect(password);

//   if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid vendor credentials");
//   }

  // const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
  //   vendor._id
  // );

  // const loggedInVendor = await Vendor.findById(vendor._id).select(
  //   "-password -refreshToken"
  // );

  // const options = {
  //   httpOnly: true,
  //   secure: true,
  
  // };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(
//         200,
//         {
//           vendor: loggedInVendor,
//           accessToken,
//           refreshToken,
//         },
//         "Vendor logged In Successfully"
//       )
//     );
// });

// const logoutVendor = asyncHandler(async (req, res) => {
//   await Vendor.findByIdAndUpdate(
//     req.vendor._id,
//     {
//       $unset: {
//         refreshToken: 1, // this removes the field from document
//       },
//     },
//     {
//       new: true,
//     }
//   );

//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "Vendor logged Out"));
// });

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken =
//     req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "unauthorized request");
//   }

//   try {
//     const decodedToken = jwt.verify(
//       incomingRefreshToken,
//       process.env.REFRESH_TOKEN_SECRET
//     );

//     const vendor = await Vendor.findById(decodedToken?._id);

//     if (!vendor) {
//       throw new ApiError(401, "Invalid refresh token");
//     }

//     if (incomingRefreshToken !== vendor?.refreshToken) {
//       throw new ApiError(401, "Refresh token is expired or used");
//     }

//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     const { accessToken, newRefreshToken } =
//       await generateAccessAndRefereshTokens(vendor._id);

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", newRefreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           { accessToken, refreshToken: newRefreshToken },
//           "Access token refreshed"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid refresh token");
//   }
// });

// const changeCurrentPassword = asyncHandler(async (req, res) => {
//   const { oldPassword, newPassword } = req.body;

//   const vendor = await Vendor.findById(req.vendor?._id);
//   const isPasswordCorrect = await vendor.isPasswordCorrect(oldPassword);

//   if (!isPasswordCorrect) {
//     throw new ApiError(400, "Invalid old password");
//   }

//   vendor.password = newPassword;
//   await vendor.save({ validateBeforeSave: false });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Password changed successfully"));
// });

const getCurrentVendor = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.vendor, "Vendor fetched successfully"));
});
const getVendorProfile = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new ApiError(400, "Vendor ID is required");
  }

  const vendor = await Vendor.findById(id).select("-password");

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { vendor }, "Vendor profile fetched successfully"));
});

const updateVendorDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const vendor = await Vendor.findByIdAndUpdate(
    req.vendor?._id,
    {
      $set: {
        firstName,
        PANumber,
        MobileNumber,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Account details updated successfully"));
});

const updateStoreLogo = asyncHandler(async (req, res) => {
  const storeLogoLocalPath = req.file?.path;

  if (!storeLogoLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const storeLogo = await uploadOnCloudinary(storeLogoLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const vendor = await Vendor.findByIdAndUpdate(
    req.vendor?._id,
    {
      $set: {
        storeLogo: storeLogo.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Avatar image updated successfully"));
});
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const vendor = await Vendor.findByIdAndUpdate(
    req.vendor?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Avatar image updated successfully"));
});

const getAllVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({}).select("-password -refreshToken");

  if (!vendors) {
    throw new ApiError(404, "No vendors found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, vendors, "All vendors fetched successfully"));
});

export {
  registerVendor,
  loginVendor,
  logoutVendor,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentVendor,
  updateVendorDetails,
  updateStoreLogo,
  updateCoverImage,
  getAllVendors,
  getVendorProfile,
};
