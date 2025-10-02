import { Router } from "express";
import {
  createUser, getAllUsers, getUserById, getUserByUsername,
  updateUser, softDeleteUser, verifyUser
} from "../controllers/user.controller.js";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);                 // ?username=...&fullName=...
router.get("/id/:id", getUserById);
router.get("/u/:username", getUserByUsername);
router.patch("/:id", updateUser);
router.delete("/:id", softDeleteUser);

// verify status=true
router.post("/verify", verifyUser);

export default router;
