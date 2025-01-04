import express from "express";

import {
  AddGateEntryOutbound,
  ListGateEntryOutbound,
  UpdateGateEntryOutbound,
} from "../../controllers/security/outboundGateEntry.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import { ListVendorMasterWithOutPermission } from "../../controllers/masters/vendor.js";
import { ListCustomerMasterWithOutPermission } from "../../controllers/masters/customer.js";
import { ListVehicleMasterWithOutPermission } from "../../controllers/masters/vehicle.js";

const router = express.Router();

router.post(
  "/add-inbound-gate-entry",
  CheckRoleAndTokenAccess,
  AddGateEntryOutbound
);
router.post(
  "/update-inbound-gate-entry",
  CheckRoleAndTokenAccess,
  UpdateGateEntryOutbound
);
router.post(
  "/list-inbound-gate-entry",
  CheckRoleAndTokenAccess,
  ListGateEntryOutbound
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
