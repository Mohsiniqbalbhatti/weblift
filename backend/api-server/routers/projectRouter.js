import { Router } from "express";
import uploadMiddleware from "../config/multer.js";
import {
  analytics,
  changeProjectName,
  checkName,
  deleteTeamMember,
  easyDrop,
  editTeamMemberRole,
  getProjectById,
  joinTeam,
  newProject,
  sendProjects,
  updateProjectFiles,
} from "../controllers/project.js";
import { validateToken } from "../middleware/authMiddleware.js";
const router = new Router();
router.post("/", validateToken, newProject);
router.get("/", validateToken, sendProjects);
router.post("/checkName", validateToken, checkName);
router.get("/:projectId", validateToken, getProjectById);
router.post("/joinTeam", validateToken, joinTeam);
router.post("/deleteTeamMember", validateToken, deleteTeamMember);
router.post("/editTeamMemberRole", validateToken, editTeamMemberRole);
router.post("/editName", validateToken, changeProjectName);
router.get("/:id/analytics", validateToken, analytics);

// Add this route
router.post(
  "/easyDrop",
  validateToken,
  uploadMiddleware.array("files"),
  easyDrop
);
// Add to projectRouter.js
router.post(
  "/updateFiles/:projectId",
  validateToken,
  uploadMiddleware.array("files"),
  updateProjectFiles
);
export default router;
