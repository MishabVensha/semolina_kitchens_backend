import express from "express";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddAuomMaster,
  ListAuomMaster,
  ListAuomMasterWithOutPermission,
  UpdateAuomMaster,
} from "../../controllers/masters/auom.js";

const router = express.Router();

router.post("/add-auom", CheckRoleAndTokenAccess, AddAuomMaster);
router.post("/update-auom", CheckRoleAndTokenAccess, UpdateAuomMaster);
router.post("/list-auom", CheckRoleAndTokenAccess, ListAuomMaster);
router.get("/list-auom-without-permission", ListAuomMasterWithOutPermission);
export default router;
