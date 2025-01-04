import express from "express";

import {
  AddGateEntryInbound,
  ListGateEntryInbound,
  UpdateGateEntryInbound,
} from "../../controllers/security/inboundGateEntry.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import { ListVendorMasterWithOutPermission } from "../../controllers/masters/vendor.js";
import { ListCustomerMasterWithOutPermission } from "../../controllers/masters/customer.js";
import { ListVehicleMasterWithOutPermission } from "../../controllers/masters/vehicle.js";

const router = express.Router();

router.post(
  "/add-inbound-gate-entry",
  CheckRoleAndTokenAccess,
  AddGateEntryInbound
);
router.post(
  "/update-inbound-gate-entry",
  CheckRoleAndTokenAccess,
  UpdateGateEntryInbound
);
router.post(
  "/list-inbound-gate-entry",
  CheckRoleAndTokenAccess,
  ListGateEntryInbound
);
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
