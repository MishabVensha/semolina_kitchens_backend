import express from "express";

import {
  
  addReturn,
  updateReturn,
  deleteReturn ,
  listReturns,
  approve
} from "../../controllers/semolina/returnorder";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";

const router = express.Router();

router.post("/returnOrder", CheckRoleAndTokenAccess, addReturn);
router.put("/updateReturn", CheckRoleAndTokenAccess, updateReturn);
router.put("/deleteReturn ", CheckRoleAndTokenAccess, deleteReturn);
router.get("/listReturns ", CheckRoleAndTokenAccess, listReturns);



router.put("/approve", CheckRoleAndTokenAccess, approve);

export default router;
