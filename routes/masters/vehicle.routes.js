import express from "express";

import {
  AddVehicleMaster,
  ListVehicleMaster,
  UpdateVehicleMaster,
} from "../../controllers/masters/vehicle.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/add-vehicle", CheckRoleAndTokenAccess, AddVehicleMaster);
router.post("/update-vehicle", CheckRoleAndTokenAccess, UpdateVehicleMaster);
router.post("/list-vehicle", CheckRoleAndTokenAccess, ListVehicleMaster);
export default router;
