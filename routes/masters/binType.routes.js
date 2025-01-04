import express from "express";

import {
  AddBinTypeMaster,
  ListBinTypeMaster,
  ListBinTypeMasterWithOutPermission,
  UpdateBinTypeMaster,
} from "../../controllers/masters/binType.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/add-bin-type", CheckRoleAndTokenAccess, AddBinTypeMaster);
router.post("/update-bin-type", CheckRoleAndTokenAccess, UpdateBinTypeMaster);
router.post("/list-bin-type", CheckRoleAndTokenAccess, ListBinTypeMaster);
router.get(
  "/list-bin-type-without-permission",
  ListBinTypeMasterWithOutPermission
);
export default router;
