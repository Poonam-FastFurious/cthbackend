import mongoose from "mongoose";

const townhallProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    skill: {
      type: [String], // Array of skills
    },
    linkedinProfile: {
      type: String,
      trim: true,
    },
    honoursAndCertifications: {
      type: [String],
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true, // Profile is public by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export const TownhallProfile = mongoose.model(
  "TownhallProfile",
  townhallProfileSchema
);
