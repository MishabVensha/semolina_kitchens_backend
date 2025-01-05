import express from "express";

import {
  
  approve
} from "../../controllers/semolina/approved";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.put("/approve", CheckRoleAndTokenAccess, approve);

export default router;