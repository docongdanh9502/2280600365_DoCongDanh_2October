import { Router } from "express";
import {
  createRole, getAllRoles, getRoleById, updateRole, softDeleteRole
} from "../controllers/role.controller.js";

const router = Router();

router.post("/", createRole);
router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.patch("/:id", updateRole);
router.delete("/:id", softDeleteRole);

export default router;
