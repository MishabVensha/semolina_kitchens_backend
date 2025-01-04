import express from "express";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddTruckLoading,
  ListTruckLoading,
  UpdateTruckLoading,
} from "../../controllers/warehouseExecutive/truckLoading.js";

const router = express.Router();

router.post("/add-truck-loading", CheckRoleAndTokenAccess, AddTruckLoading);
router.post(
  "/update-truck-loading",
  CheckRoleAndTokenAccess,
  UpdateTruckLoading
);
router.post("/list-truck-loading", CheckRoleAndTokenAccess, ListTruckLoading);

export default router;
