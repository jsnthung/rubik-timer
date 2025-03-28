import mongoose from "mongoose";

const solveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    penalty: {
      type: String,
      enum: [null, "+2", "DNF"],
      default: null,
    },
    scramble: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Solve = mongoose.model("Solve", solveSchema);
