import mongoose from "mongoose";

const returnTransferOrderSchema = new mongoose.Schema({
  gateNo: {
    type: String,
    required: true,
  },
  order_no: {
    type: Number,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "confirm"],
    default: "Pending",
  },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
  assigned_to: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    default: null,
    trim: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const ReturnTransferOrderModel = mongoose.model(
  "returnTransferOrder",
  returnTransferOrderSchema
);

export default ReturnTransferOrderModel;
