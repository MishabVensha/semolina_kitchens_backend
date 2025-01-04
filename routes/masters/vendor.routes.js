import express from "express";

import {
  AddVendorMaster,
  ListVendorMaster,
  UpdateVendorMaster,
} from "../../controllers/masters/vendor.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/add-vendor", CheckRoleAndTokenAccess, AddVendorMaster);
router.post("/update-vendor", CheckRoleAndTokenAccess, UpdateVendorMaster);
router.post("/list-vendor", CheckRoleAndTokenAccess, ListVendorMaster);
export default router;
