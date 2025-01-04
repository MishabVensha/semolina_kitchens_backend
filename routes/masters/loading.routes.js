import express from "express";

import {
  AddLoading,
  ListLoadingMaster,
  UpdateLoadingMaster,
} from "../../controllers/masters/loading.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/add-loading", CheckRoleAndTokenAccess, AddLoading);
router.post("/update-loading", CheckRoleAndTokenAccess, UpdateLoadingMaster);
router.post("/list-loading", CheckRoleAndTokenAccess, ListLoadingMaster);
export default router;
