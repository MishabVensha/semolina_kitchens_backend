import express from "express";

import {
  AddUnLoadingMaster,
  ListUnLoadingMaster,
  UpdateUnLoadingMaster
} from "../../controllers/masters/unloading.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/add-unloading", CheckRoleAndTokenAccess, AddUnLoadingMaster);
router.post(
  "/update-unloading",
  CheckRoleAndTokenAccess,
  UpdateUnLoadingMaster
);
router.post("/list-unloading", CheckRoleAndTokenAccess, ListUnLoadingMaster);
export default router;
