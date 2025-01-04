import express from "express";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddStorageTypeMaster,
  ListStorageTypeMaster,
  UpdateStorageTypeMaster,
} from "../../controllers/masters/storageType.js";

const router = express.Router();

router.post("/add-storage-type", CheckRoleAndTokenAccess, AddStorageTypeMaster);
router.post(
  "/update-storage-type",
  CheckRoleAndTokenAccess,
  UpdateStorageTypeMaster
);
router.post(
  "/list-storage-type",
  CheckRoleAndTokenAccess,
  ListStorageTypeMaster
);
export default router;
