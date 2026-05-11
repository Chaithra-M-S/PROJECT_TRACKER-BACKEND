import express from "express";
import { createTeam,checkTeamLead,getMyTeam,updateTeamMembers } from "../controllers/teamController.js";
import {
   verifyToken,
   authorizeRoles
} from "../middleware/auth.js";

const router = express.Router();

router.post(
   "/create",
   verifyToken,
   authorizeRoles("ADMIN", "MANAGER","TEAMLEAD"),
   createTeam
);

router.get(
   "/check-teamlead",
   verifyToken,
   checkTeamLead
);

router.get(
   "/my-team",
   verifyToken,
   getMyTeam
);

router.put(
  "/:id/members",
  verifyToken,
  authorizeRoles("MANAGER", "TEAMLEAD"),
  updateTeamMembers
);

export default router;