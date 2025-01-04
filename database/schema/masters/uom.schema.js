import mongoose from "mongoose";

const UomSchema = new mongoose.Schema({
  uom: {
    type: String,
    required: [true, "Uom is required."],
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

const UomModel = mongoose.model("uom", UomSchema);

export default UomModel;
