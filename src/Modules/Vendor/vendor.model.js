import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// Define a schema for the user
const vendorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:true,
  },
  lastName: {
    type: String,
  },
  storeName: {
    type: String,
  },
  address: {
    type: String,
  },
  storeLogo: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  storeLegalName: {
    type: String,
    required: true,
    unique: true,
  },
  GSTNumber: {
    type: String,
  },
  PANNumber: {
    type: String,
    required:true,
  },
  registerAs: {
    type: String,
    enum: ["Vendor", "Pandit", "Temple","TouristGuide"],
  },
  username: {
    type: String,
  },
  mobileNumber: {
    type: Number,
    required:true,
  },
  GSTCertificate: {
    type: Date,
  },
  PANCard: {
    type: String,
  },
});
// vendorSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// vendorSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// vendorSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//       fullName: this.fullName,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };
// vendorSchema.methods.generateRefreshToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );
// };
// Create a User model based on the schema
export const vendor = mongoose.model("User", vendorSchema);
