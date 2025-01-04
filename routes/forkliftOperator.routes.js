import express from "express";
import {
  AddForkliftOperator,
  ListDistinctForkliftOperatorTask,
  ListDistinctForkliftOperatorTaskOutbound,
  UpdateForkliftOperator
} from "../controllers/forkliftOperator.js";
import CheckRoleAndTokenAccess from "../middlewares/permission.js";

const router = express.Router();
router.post(
  "/add-forklift-operator",
  CheckRoleAndTokenAccess,
  AddForkliftOperator
);
router.post(
  "/update-forklift-operator",
  CheckRoleAndTokenAccess,
  UpdateForkliftOperator
);
router.post(
  "/list-forklift-operator",
  CheckRoleAndTokenAccess,
  ListDistinctForkliftOperatorTask
);
router.post(
  "/list-forklift-operator-outbound",
  CheckRoleAndTokenAccess,
  ListDistinctForkliftOperatorTaskOutbound
);

export default router;
