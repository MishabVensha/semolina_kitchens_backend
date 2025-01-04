import express from "express";

import {
  AddBinMaster,
  ListBinMaster,
  ListBinMasterWithOutPermission,
  UpdateBinMaster,
} from "../../controllers/masters/bin.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/add-bin", CheckRoleAndTokenAccess, AddBinMaster);
router.post("/update-bin", CheckRoleAndTokenAccess, UpdateBinMaster);
router.post("/list-bin", CheckRoleAndTokenAccess, ListBinMaster);
router.get(
  "/list-storage-type-without-permission",
  ListBinMasterWithOutPermission
);
export default router;
