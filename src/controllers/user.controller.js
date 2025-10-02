import { User } from "../models/user.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

// CREATE
export const createUser = asyncHandler(async (req, res) => {
  const {
    username, password, email, role, // required
    fullName = "", avatarUrl = "", status = false, loginCount = 0
  } = req.body;

  if (!username || !password || !email || !role) {
    return res.status(400).json({ message: "username, password, email, role are required" });
  }
  // Mongoose sẽ check unique; kiểm tra sơ bộ để trả 409 sớm
  const dup = await User.findOne({ $or: [{ username }, { email }] });
  if (dup) return res.status(409).json({ message: "username or email already exists" });

  const user = await User.create({
    username, password, email, role, fullName, avatarUrl, status, loginCount
  });
  res.status(201).json(user);
});

// GET ALL (+ search contains username/fullName), chỉ lấy isDelete=false
export const getAllUsers = asyncHandler(async (req, res) => {
  const { username, fullName } = req.query;
  const filter = { isDelete: false };
  if (username) filter.username = { $regex: username, $options: "i" };
  if (fullName) filter.fullName = { $regex: fullName, $options: "i" };

  const users = await User.find(filter)
    .populate("role")
    .sort({ createdAt: -1 });
  res.json(users);
});

// GET BY ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  const user = await User.findOne({ _id: id, isDelete: false }).populate("role");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// GET BY USERNAME
export const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username, isDelete: false }).populate("role");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = {};
  const fields = ["password","email","fullName","avatarUrl","status","role","loginCount","username"];
  for (const f of fields) if (req.body[f] !== undefined) payload[f] = req.body[f];

  const user = await User.findOneAndUpdate(
    { _id: id, isDelete: false },
    { $set: payload },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// SOFT DELETE
export const softDeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: id, isDelete: false },
    { $set: { isDelete: true } },
    { new: true }
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User soft-deleted", user });
});

// VERIFY: POST {email, username} => status=true nếu khớp
export const verifyUser = asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) return res.status(400).json({ message: "email and username are required" });

  const user = await User.findOneAndUpdate(
    { email, username, isDelete: false },
    { $set: { status: true } },
    { new: true }
  );
  if (!user) return res.status(404).json({ message: "User not found or deleted" });

  res.json({ message: "Verified", user });
});
