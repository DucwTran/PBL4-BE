import mongoose from "mongoose";
import { v4 } from "uuid";
const { Schema } = mongoose;

const fileSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      default: v4,
    },
    status: {
      type: String,
    },
    public_id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema, "files");

export default File;
