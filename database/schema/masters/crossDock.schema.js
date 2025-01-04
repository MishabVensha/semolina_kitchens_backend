import mongoose from "mongoose";

const CrossDockSchema = new mongoose.Schema({
  cross_dock_name: {
    type: String,
    required: [true, "Cross Dock Name is required."],
    trim: true,
    unique: [true, "Cross Dock Name already exist."],
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

const CrossDockModel = mongoose.model("crossDock", CrossDockSchema);

export default CrossDockModel;
