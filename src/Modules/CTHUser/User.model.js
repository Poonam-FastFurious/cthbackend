import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/, // Basic email validation
    },
    linkedinProfile: {
      type: String,
    },
    address: {
      type: String,
    },
    profilePhoto: {
      type: String, // URL to the profile photo
    },
    profilePhotoVisibility: {
      type: String,
      default: "Everyone",
    },
    LastSeen: {
      type: Boolean,
      default: true,
    },
    AccountStatus: {
      type: String,
      default: "Private",
    },
    ReadReceipt: {
      type: Boolean,
      default: true,
    },
    IsApproved: {
      type: Boolean,
      default: false,
    },
    Active: {
      type: Boolean,
    },
    Status: {
      type: String,
      default: "Everyone",
    },
    lastActive: {
      type: Date,
    },
    LoginTime: {
      type: Date,
    },
    skills: {
      type: [String],
    },
    gender: {
      type: String,
    },
    honoursAndCertifications: {
      type: [String], // Array of honours and certifications
    },
    refreshToken: {
      type: String,
    },
    OTP: {
      type: String,
    },
    otpExpires: { type: Date },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);
userSchema.methods.isOTPCorrect = async function (otp) {
  return await bcrypt.compare(otp, this.OTP);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("OTP")) {
    this.OTP = await bcrypt.hash(this.OTP, 10);
  }
  next();
});
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
