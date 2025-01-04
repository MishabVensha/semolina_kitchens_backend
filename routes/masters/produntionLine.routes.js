import express from "express";
import bulk from "../../config/bulkUpload/bulk.js";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddProduntionLineMaster,
  BulkUploadProduntionLineMaster,
  DropdownProduntionLineMaster,
  ListProduntionLineMaster,
  UpdateProduntionLineMaster,
} from "../../controllers/masters/produntionLine.js";

const router = express.Router();

router.post(
  "/add-produntion-line-master",
  CheckRoleAndTokenAccess,
  AddProduntionLineMaster
);
router.post(
  "/update-produntion-line-master",
  CheckRoleAndTokenAccess,
  UpdateProduntionLineMaster
);
router.post(
  "/list-produntion-line-master",
  CheckRoleAndTokenAccess,
  ListProduntionLineMaster
);
router.get("/dropdown-produntion-line-master", DropdownProduntionLineMaster);

router.post(
  "/bulk-upload-produntion-line-master",
  CheckRoleAndTokenAccess,
  bulk("/pallete_master_bulk_upload").single("excelFile"),
  BulkUploadProduntionLineMaster
);

export default router;
