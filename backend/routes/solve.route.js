import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addSolve,
  getSolvesByUser,
  updateSolve,
  deleteSolve,
} from "../controllers/solve.controller.js";

const router = express.Router();

router.post("/", verifyToken, addSolve);
router.get("/", verifyToken, getSolvesByUser);
router.put("/:id", verifyToken, updateSolve);
router.delete("/:id", verifyToken, deleteSolve);

export default router;
