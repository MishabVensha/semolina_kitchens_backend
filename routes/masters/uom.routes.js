import express from "express";

import {
  AddUomMaster,
  ListUomMaster,
  ListUomMasterWithOutPermission,
  UpdateUomMaster,
} from "../../controllers/masters/uom.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/add-uom", CheckRoleAndTokenAccess, AddUomMaster);
router.post("/update-uom", CheckRoleAndTokenAccess, UpdateUomMaster);
router.post("/list-uom", CheckRoleAndTokenAccess, ListUomMaster);
router.get("/list-uom-without-permission", ListUomMasterWithOutPermission);
export default router;
