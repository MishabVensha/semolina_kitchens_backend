import express from "express";

import {
  
  addReturn,
  approve
} from "../../controllers/semolina/returnorder";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/returnOrder", CheckRoleAndTokenAccess, addReturn);
router.put("/approve", CheckRoleAndTokenAccess, approve);

export default router;
