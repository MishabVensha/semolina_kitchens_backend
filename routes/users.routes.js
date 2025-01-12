import express from "express";
import {
  AddUser,
  AdminChangePassword,
  DeleteUser,
  EmpIDList,
  EmployeeIdAutoGenerate,
  ListEmployeeById,
  ListUser,
  RoleNameList,
  UpdateUser,
} from "../controllers/users.js";
import CheckRoleAndTokenAccess from "../middlewares/permission.js";

const router = express.Router();
router.post("/add-user", CheckRoleAndTokenAccess, AddUser);
router.post("/update-user", CheckRoleAndTokenAccess, UpdateUser);
router.post("/list-user", CheckRoleAndTokenAccess, ListUser);
router.delete("/delete-user", CheckRoleAndTokenAccess, DeleteUser);
router.patch(
  "/admin-change-password",
  CheckRoleAndTokenAccess,
  AdminChangePassword
);
router.get("/role-name-list", RoleNameList);
router.get("/list-emp-without-permission", EmpIDList);
router.get("/employee-id-auto-generate", EmployeeIdAutoGenerate);
router.get("/list-employee-byId", ListEmployeeById);

export default router;
