import express from "express";
import {
  AddOutbound,
  CrossDockPickup,
  GetForkliftTaskCounts,
  ListOutboundSO,
  ListOutboundSTO,
} from "../../controllers/warehouseExecutive/outbond.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/add-outbound", CheckRoleAndTokenAccess, AddOutbound);
router.post("/list-outbound-sto", CheckRoleAndTokenAccess, ListOutboundSO);
router.post("/list-outbound-so", CheckRoleAndTokenAccess, ListOutboundSTO);
router.post("/send-to-crossDockPickup", CrossDockPickup);
router.post("/send-to-forklift", GetForkliftTaskCounts);

export default router;
