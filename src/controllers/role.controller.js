import { Role } from "../models/role.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// CREATE
export const createRole = asyncHandler(async (req, res) => {
  const { name, description = "" } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });

  const exists = await Role.findOne({ name });
  if (exists) return res.status(409).json({ message: "Role name already exists" });

  const role = await Role.create({ name, description });
  res.status(201).json(role);
});

// GET ALL (mặc định chỉ lấy isDelete=false)
export const getAllRoles = asyncHandler(async (_req, res) => {
  const roles = await Role.find({ isDelete: false }).sort({ createdAt: -1 });
  res.json(roles);
});

// GET BY ID
export const getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findOne({ _id: req.params.id, isDelete: false });
  if (!role) return res.status(404).json({ message: "Role not found" });
  res.json(role);
});

// UPDATE
export const updateRole = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const role = await Role.findOneAndUpdate(
    { _id: req.params.id, isDelete: false },
    { $set: { ...(name && { name }), ...(description !== undefined && { description }) } },
    { new: true, runValidators: true }
  );
  if (!role) return res.status(404).json({ message: "Role not found" });
  res.json(role);
});

// SOFT DELETE
export const softDeleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findOneAndUpdate(
    { _id: req.params.id, isDelete: false },
    { $set: { isDelete: true } },
    { new: true }
  );
  if (!role) return res.status(404).json({ message: "Role not found" });
  res.json({ message: "Role soft-deleted", role });
});
