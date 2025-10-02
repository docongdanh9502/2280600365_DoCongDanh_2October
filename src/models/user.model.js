import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    status: { type: Boolean, default: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    loginCount: { type: Number, default: 0, min: 0 },
    isDelete: { type: Boolean, default: false }
  },
  { timestamps: true }
);


export const User = mongoose.model("User", userSchema);
