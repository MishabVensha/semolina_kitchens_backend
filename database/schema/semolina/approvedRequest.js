import mongoose from "mongoose";

const requestApprovedSchema = new mongoose.Schema({
  gateNo: {
    type: String,
    required: true,
  },
  returnOrder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "returnOrder",
    default: null,
  },
  approvalLevel: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: null,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User or relevant model
    ref: "User", // The name of the model you're referencing
    default: null,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const RequestApprovedModel = mongoose.model(
  "requestApproved",
  requestApprovedSchema
);

export default RequestApprovedModel;
