import express from "express";
import bulk from "../../config/bulkUpload/bulk.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddMaterialMaster,
  BulkUploadMaterial,
  ListMaterialMaster,
  ListMaterialMasterWithOutPermission,
  UpdateMaterialMaster,
} from "../../controllers/masters/material.js";

const router = express.Router();
router.post(
  "/bulk-upload-material",
  bulk("/material_bulk_upload").single("excelFile"),
  CheckRoleAndTokenAccess,
  BulkUploadMaterial
);
router.post("/add-material-master", CheckRoleAndTokenAccess, AddMaterialMaster);
router.post(
  "/update-material-master",
  CheckRoleAndTokenAccess,
  UpdateMaterialMaster
);
router.post(
  "/list-material-master",
  CheckRoleAndTokenAccess,
  ListMaterialMaster
);
router.get(
  "/list-material-master-without-permission",
  ListMaterialMasterWithOutPermission
);

export default router;
