import express from "express";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  addReturn,
  ListEmployeesByLevel,
  ListReturnOrder,
} from "../../controllers/semolina/returnorder.js";
import { GetApproveById } from "../../controllers/semolina/approvedRequest.js";
// import { approve } from "../../controllers/semolina/approvedRequest.js";

const router = express.Router();

router.post("/add-return-order", CheckRoleAndTokenAccess, addReturn);
router.post("/list-return-order", ListReturnOrder);
// router.put("/approve", CheckRoleAndTokenAccess, approve);
router.get("/list-employees-by-level", ListEmployeesByLevel);
router.get("/list-approvelist-by-id", GetApproveById);

export default router;
