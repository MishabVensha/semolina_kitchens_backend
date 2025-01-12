import express from "express";
import { ListPendingApprove, UpdateStatus } from "../../controllers/semolina/approvedRequest.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/update-status", CheckRoleAndTokenAccess, UpdateStatus);
router.post(
  "/list-pending-approvel",
  CheckRoleAndTokenAccess,
  ListPendingApprove
);

export default router;
