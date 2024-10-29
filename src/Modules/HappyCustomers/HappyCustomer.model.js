import mongoose from "mongoose";
const { Schema } = mongoose;

const HappyCustomerSchema = new Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
    },
    Name: {
        type: String,
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

export const HappyCustomer = mongoose.model(
  "HappyCustomer",
  HappyCustomerSchema
);
