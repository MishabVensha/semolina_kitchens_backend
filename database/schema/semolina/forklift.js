import mongoose from "mongoose";

const forkliftSchema = new mongoose.Schema({
  gateNo: {
    type: String,
    required: true,
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
  transferOrder: {
    type: mongoose.Types.ObjectId,
    ref: "returnTransferOrder",
    default: null,
    trim: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const ForkliftModel = mongoose.model("forklift", forkliftSchema);

export default ForkliftModel;
