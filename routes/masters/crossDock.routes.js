import express from "express";

import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import {
  AddCrossDockMaster,
  DropdownCrossDockMaster,
  ListCrossDockMaster,
  UpdateCrossDockMaster,
} from "../../controllers/masters/crossDock.js";

const router = express.Router();

router.post(
  "/add-cross-dock-master",
  CheckRoleAndTokenAccess,
  AddCrossDockMaster
);
router.post(
  "/update-cross-dock-master",
  CheckRoleAndTokenAccess,
  UpdateCrossDockMaster
);
router.post(
  "/list-cross-dock-master",
  CheckRoleAndTokenAccess,
  ListCrossDockMaster
);
router.get("/dropdown-cross-dock-master", DropdownCrossDockMaster);

export default router;
