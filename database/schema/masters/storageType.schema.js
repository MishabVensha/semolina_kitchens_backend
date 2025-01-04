import mongoose from "mongoose";

const storageTypeSchema = new mongoose.Schema({
  storage_type: {
    type: String,
    required: [true, "storage type is required."],
    trim: true,
    unique: [true, "storage type already exist."],
  },
  storage_type_description: {
    type: String,
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
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const storageTypeModel = mongoose.model("storageType", storageTypeSchema);

export default storageTypeModel;
