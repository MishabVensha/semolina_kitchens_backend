import express from "express";
import {
  AddRole,
  DropdownForkliftRole,
  DropdownRoleMaster,
  ListRoles,
  UpdateRole,
} from "../controllers/roles.js";
import CheckRoleAndTokenAccess from "../middlewares/permission.js";

const router = express.Router();
router.post("/add-role", CheckRoleAndTokenAccess,AddRole);
router.post("/update-role", CheckRoleAndTokenAccess, UpdateRole);
router.post("/list-role", CheckRoleAndTokenAccess, ListRoles);
router.get("/dropdown-roles-master", DropdownRoleMaster);
router.get("/dropdown-forklift-roles", DropdownForkliftRole);



export default router;
