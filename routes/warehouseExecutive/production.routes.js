import express from "express";
import bulk from "../../config/bulkUpload/bulk.js";
import {
  AddProduction,
  BulkUploadBin,
  BulkUploadProduction,
  FetchAllSkuDetails,
  FetchSkuDetails,
  GetAllStatusCount,
  ListBin,
  ListProductionReport,
  ListProductionWithOutPermission,
  ListProduntion,
  ListTransaction,
  UpdateProduntionMaster,
  VerifyBin,
  VerifyBinoutbound
} from "../../controllers/warehouseExecutive/production.js";
import CheckRoleAndTokenAccess from "../../middlewares/permission.js";
import { ListStockTable } from "../../controllers/warehouseExecutive/stockReport.js";
import { GetForkliftTaskCounts } from "../../controllers/warehouseExecutive/dashboard.js";
import {
  AllocateBin,
  BinOverflow,
  CrossDockerAllocate,
  SetLastPallet,
} from "../../controllers/warehouseExecutive/prductionAction.js";
const router = express.Router();
//Raw Veneer
router.post(
  "/bulk-upload-production",
  bulk("/raw_material_bulk_upload").single("excelFile"),
  BulkUploadProduction
);
router.post(
  "/bulk-upload-bin",
  bulk("/bin_bulk_upload").single("excelFile"),
  BulkUploadBin
);
router.post("/add-production", CheckRoleAndTokenAccess, AddProduction);
router.post("/list-production", CheckRoleAndTokenAccess, ListProduntion);
router.post("/list-stock-table", CheckRoleAndTokenAccess, ListStockTable);
router.post("/list-transaction", CheckRoleAndTokenAccess, ListTransaction);
router.post(
  "/update-partial-to-delete-production",
  CheckRoleAndTokenAccess,
  SetLastPallet
);
router.post(
  "/update-production",
  CheckRoleAndTokenAccess,
  UpdateProduntionMaster
);
router.get("/sku-details", FetchSkuDetails);
router.post(
  "/get-all-status-count",
  CheckRoleAndTokenAccess,
  GetAllStatusCount
);
router.post(
  "/get-all-forklift-task-count",
  CheckRoleAndTokenAccess,
  GetForkliftTaskCounts
);
router.get("/sku-all-details", FetchAllSkuDetails);
router.post("/list-bin", ListBin);
router.post("/allocate-bin", AllocateBin);
router.post("/cross-docker-allocate", CrossDockerAllocate);
router.post("/verify-bin",CheckRoleAndTokenAccess, VerifyBin);
router.post("/production-report",CheckRoleAndTokenAccess, ListProductionReport);
router.post("/bin-overflow-allocate", BinOverflow);
router.get("/get-production", ListProductionWithOutPermission);
router.post("/verify-bin-outbound", VerifyBinoutbound);
export default router;
