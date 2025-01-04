import mongoose from "mongoose";

const ProductionLineSchema = new mongoose.Schema({
  production_line_name: {
    type: String,
    required: [true, "Production Line Name is required."],
    trim: true,
    unique: [true, "Production Line Name already exist."],
  },
  production_line_description: {
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

const ProductionLineModel = mongoose.model(
  "productionLine",
  ProductionLineSchema
);

export default ProductionLineModel;
