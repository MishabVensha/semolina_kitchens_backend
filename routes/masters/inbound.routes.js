import express from "express";

import {
  AddInbound,
  ListInbound,
  UpdateInbound,
} from "../../controllers/masters/inbound.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import { ListVendorMasterWithOutPermission } from "../../controllers/masters/vendor.js";
import { ListCustomerMasterWithOutPermission } from "../../controllers/masters/customer.js";
import { ListVehicleMasterWithOutPermission } from "../../controllers/masters/vehicle.js";

const router = express.Router();

router.post("/add-inbound", CheckRoleAndTokenAccess, AddInbound);
router.post("/update-inbound", CheckRoleAndTokenAccess, UpdateInbound);
router.post("/list-inbound", CheckRoleAndTokenAccess, ListInbound);
router.get(
  "/list-vendor-without-permission",
  ListVendorMasterWithOutPermission
);
router.get(
  "/list-customer-without-permission",
  ListCustomerMasterWithOutPermission
);
router.get(
  "/list-vehicle-without-permission",
  ListVehicleMasterWithOutPermission
);
export default router;
