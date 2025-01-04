import express from "express";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddDelivery,
  ListDelivery,
  UpdateDelivery,
} from "../../controllers/warehouseExecutive/delivery.js";

const router = express.Router();

router.post("/add-delivery", CheckRoleAndTokenAccess, AddDelivery);
router.post("/update-delivery", CheckRoleAndTokenAccess, UpdateDelivery);
router.post("/list-delivery", CheckRoleAndTokenAccess, ListDelivery);

export default router;
