import express from "express";
import bulk from "../../config/bulkUpload/bulk.js";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddCustomerTypeMaster,
  BulkUploadCustomerTypeMaster,
  DropdownCustomerTypeMaster,
  ListCustomerTypeMaster,
  UpdateCustomerTypeMaster,
} from "../../controllers/masters/customerType.js";

const router = express.Router();

router.post(
  "/add-customer-type-master",
  CheckRoleAndTokenAccess,
  AddCustomerTypeMaster
);
router.post(
  "/update-customer-type-master",
  CheckRoleAndTokenAccess,
  UpdateCustomerTypeMaster
);
router.post(
  "/list-customer-type-master",
  CheckRoleAndTokenAccess,
  ListCustomerTypeMaster
);
router.get("/dropdown-customer-type-master", DropdownCustomerTypeMaster);

router.post(
  "/bulk-upload-customer-type-master",
  CheckRoleAndTokenAccess,
  bulk("/pallete_master_bulk_upload").single("excelFile"),
  BulkUploadCustomerTypeMaster
);

export default router;
