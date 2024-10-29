import mongoose from "mongoose";
const { Schema } = mongoose;

const videoTestimonialSchema = new Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const VideoTestimonial = mongoose.model("VideoTestimonial", videoTestimonialSchema);
