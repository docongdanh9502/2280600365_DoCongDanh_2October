import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    isDelete: { type: Boolean, default: false }
  },
  { timestamps: true }
);


export const Role = mongoose.model("Role", roleSchema);
