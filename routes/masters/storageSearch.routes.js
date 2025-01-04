import express from "express";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddStorageSearchMaster,
  ListStorageSearchMaster,
  UpdateStorageSearchMaster,
} from "../../controllers/masters/storageSearch.js";

const router = express.Router();

router.post(
  "/add-storage-search",
  CheckRoleAndTokenAccess,
  AddStorageSearchMaster
);
router.post(
  "/update-storage-search",
  CheckRoleAndTokenAccess,
  UpdateStorageSearchMaster
);
router.post(
  "/list-storage-search",
  CheckRoleAndTokenAccess,
  ListStorageSearchMaster
);
export default router;
