import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import getConfigs from "./config/config.js";
import mongo_service from "./database/mongo.service.js";
import authRouter from "./routes/auth.routes.js";
import ProductionLineMasterRouter from "./routes/masters/produntionLine.routes.js";
import MaterialMasterRouter from "./routes/masters/material.routes.js";
import BinRouter from "./routes/masters/bin.routes.js";
import StorageTypeRouter from "./routes/masters/storageType.routes.js";
import StorageSearchRouter from "./routes/masters/storageSearch.routes.js";
import CustomerRouter from "./routes/masters/customer.routes.js";
import InboundRouter from "./routes/masters/inbound.routes.js";
import OutboundRouter from "./routes/warehouseExecutive/outbond.routes.js";
import VehicleRouter from "./routes/masters/vehicle.routes.js";
import VendorRouter from "./routes/masters/vendor.routes.js";
import profileRouter from "./routes/profile.routes.js";
import rolesRouter from "./routes/roles.routes.js";
import usersRouter from "./routes/users.routes.js";
import LoadingRouter from "./routes/masters/loading.routes.js";
import CustomerTypeMasterRouter from "./routes/masters/customerType.routes.js";
import BinTypeRouter from "./routes/masters/binType.routes.js";
import UomRouter from "./routes/masters/uom.routes.js";
import AuomRouter from "./routes/masters/auom.routes.js";
import UnLoadingRouter from "./routes/masters/unloading.routes.js";
import CrossDockRouter from "./routes/masters/crossDock.routes.js";
import InboundGateEntryRouter from "./routes/security/inboundGateEntry.routes.js";
import OutboundGateEntryRouter from "./routes/security/outboundGateEntry.routes.js";
import ProductionMasterRouter from "./routes/warehouseExecutive/production.routes.js";
import ForkliftOperatorMasterRouter from "./routes/forkliftOperator.routes.js";
import TruckLoadingRouter from "./routes/warehouseExecutive/truckLoading.routes.js";
import DeliveryRouter from "./routes/warehouseExecutive/delivery.routes.js";
import { globalErrorHandler } from "./utils/errors/globalErrorHandler.js";
const Configs = getConfigs();
mongo_service();
const app = express();
app.get("/", (req, res) => {
  res.send("working fineeeeeeeeee");
});
const server = http.createServer(app);
const PORT = Configs.server.port;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.json());

var corsOptions = {
  origin: Configs.cors.origin,
  optionsSuccessStatus: 200,
  credentials: Configs.cors.credentials,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("./upload"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));
app.use(cookieParser());

app.use(`/api/${Configs.server.version}/auth`, authRouter);
app.use(`/api/${Configs.server.version}/user`, usersRouter);
app.use(`/api/${Configs.server.version}/role`, rolesRouter);
app.use(`/api/${Configs.server.version}/profile`, profileRouter);

// master
app.use(`/api/${Configs.server.version}/material-master`, MaterialMasterRouter);
app.use(
  `/api/${Configs.server.version}/production-line`,
  ProductionLineMasterRouter
);
app.use(
  `/api/${Configs.server.version}/customer-type`,
  CustomerTypeMasterRouter
);
app.use(`/api/${Configs.server.version}/production`, ProductionMasterRouter);
app.use(`/api/${Configs.server.version}/inbound`, InboundRouter);
app.use(`/api/${Configs.server.version}/outbound`, OutboundRouter);
app.use(`/api/${Configs.server.version}/vendor`, VendorRouter);
app.use(`/api/${Configs.server.version}/customer`, CustomerRouter);
app.use(`/api/${Configs.server.version}/vehicle`, VehicleRouter);
app.use(`/api/${Configs.server.version}/storage-type`, StorageTypeRouter);
app.use(`/api/${Configs.server.version}/bin`, BinRouter);
app.use(`/api/${Configs.server.version}/storage-search`, StorageSearchRouter);
app.use(`/api/${Configs.server.version}/loading`, LoadingRouter);
app.use(`/api/${Configs.server.version}/unloading`, UnLoadingRouter);
app.use(`/api/${Configs.server.version}/cross-dock`, CrossDockRouter);
app.use(`/api/${Configs.server.version}/bin-type`, BinTypeRouter);
app.use(`/api/${Configs.server.version}/uom`, UomRouter);
app.use(`/api/${Configs.server.version}/auom`, AuomRouter);
app.use(
  `/api/${Configs.server.version}/outbound-gate-entry`,
  OutboundGateEntryRouter
);
app.use(
  `/api/${Configs.server.version}/inbound-gate-entry`,
  InboundGateEntryRouter
);
app.use(
  `/api/${Configs.server.version}/forklift-operator`,
  ForkliftOperatorMasterRouter
);
app.use(`/api/${Configs.server.version}/truck-loading`, TruckLoadingRouter);
app.use(`/api/${Configs.server.version}/delivery`, DeliveryRouter);
app.use(globalErrorHandler);
// Error handling for the server
server.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
