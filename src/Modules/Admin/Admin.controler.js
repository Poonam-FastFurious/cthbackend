import { asyncHandler } from "../../utils/asyncHandler.js";
import connectDB from "../../db/index.js";
import { Admin } from "./Admin.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const initializeAdmin = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const admin = await Admin.findOne({ isAdmin: true });

    if (!admin) {
      const adminuser = new Admin({
        username: "admin",
        password: "admin@123",
        email: "admin@gmail.com",
        profilePhoto:
          "https://themesbrand.com/velzon/html/master/assets/images/users/avatar-1.jpg",
      });
      await adminuser.save();
      console.log("admin created");
    } else {
      console.log("admin already exists");
    }
  } catch (error) {
    console.log("database connection failed in initialize admin", error);
    throw new ApiError(500, "Database connection failed", error.message);
  }
});

export { initializeAdmin };
const loginAdmin = async (req, res) => {
  const generateAccessAndRefereshTokens = async (userId) => {
    try {
      const admin = await Admin.findById(userId);
      const accessToken = admin.generateAccessToken();
      const refreshToken = admin.generateRefreshToken();

      admin.refreshToken = refreshToken;
      admin.loginTime = new Date();
      await admin.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating refresh and access token"
      );
    }
  };

  try {
    const { email, username, password } = req.body;

    if (!decodedToken?._id) {
      console.error("Unauthorized request: Invalid token structure");
      throw new ApiError(401, "Unauthorized request: Invalid token structure");
    }

    console.log("Fetching admin with ID:", decodedToken._id);
    const admin = await Admin.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!admin) {
      console.error("Unauthorized request: Admin not found");
      throw new ApiError(401, "Unauthorized request: Admin not found");
    }

    req.admin = admin; // Attach admin to the request object
    next();
  } catch (error) {
    console.error("Error during logout:", error);

    // Handle specific errors
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    // Handle other unexpected errors
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getAdminDetails = async (req, res) => {
  connectDB();
  try {
    const adminId = req.query.adminId; // Extract adminId from query params
    if (!adminId) {
      throw new ApiError(400, "Admin ID is required in query params");
    }

    // Fetch admin details from the database based on the adminId
    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    const adminDetails = {
      firstName: admin.firstName || "", // If firstName is null or undefined, assign an empty string
      lastName: admin.lastName || "",
      phoneNumber: admin.phoneNumber || "",
      email: admin.email || "",
      loginTime: admin.loginTime || null, // You can set a default value for dates as needed
      designation: admin.designation || "",
      website: admin.website || "",
      city: admin.city || "",
      country: admin.country || "",
      zipCode: admin.zipCode || "",
      username: admin.username || "",
      profilePhoto: admin.profilePhoto || "",
      portfolioLink: admin.portfolioLink || "",
      loginHistory: admin.loginHistory || [],
      isAdmin: admin.isAdmin,
    };

    // Send admin details in the response
    res.json(
      new ApiResponse(200, adminDetails, "Admin details retrieved successfully")
    );
  } catch (error) {
    console.error("Error fetching admin details:", error);

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
const updateAdmin = async (req, res) => {
  const {
    adminId,
    firstName,
    lastName,
    phoneNumber,
    email,
    designation,
    website,
    city,
    country,
    zipCode,
    username,
    profilePhoto,
    portfolioLink,
  } = req.body;

  try {
    if (!adminId) {
      return res.status(400).json({ error: "admin id are required" });
    }

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      {
        $set: {
          firstName,
          lastName,
          phoneNumber,
          email,
          designation,
          website,
          city,
          country,
          zipCode,
          username,
          profilePhoto,
          portfolioLink,
        },
      },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    return res
      .status(200)
      .json({ message: "Account details updated successfully", admin });
  } catch (error) {
    console.error("Error updating account details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const changeAdminPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!req.admin) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password");
    }

    admin.password = newPassword;
    await admin.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    console.log("Error in changing admin password", error);
    throw new ApiError(500, "Error in changing admin password", error.message);
  }
});

export {
  loginAdmin,
  logoutAdmin,
  getAdminDetails,
  updateAdmin,
  changeAdminPassword,
};
