import mongoose from "mongoose";

const BinSchema = new mongoose.Schema({
  storage_type: {
    type: String,
    required: [true, "Storage Type is required."],
    default: "Select",
    trim: true,
  },
  storage_section: {
    type: String,
    required: [true, "Storage Section is required."],
    trim: true,
  },
  bin_no: {
    type: String,
    required: [true, "Bin Number is required."],
    trim: true,
  },
  bin_combination: {
    type: String,
    trim: true,
  },
  bin_combination_no: {
    type: Number,
    trim: true,
  },
  type: {
    type: mongoose.Types.ObjectId,
    ref: "bintypes",
    required: [true, "Type is required."],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  bin_capacity: {
    type: Number,
    required: [true, "Bin Capacity is required."],
  },
  digit_3_code: {
    type: String,
    required: [true, "3 Digit Code is required."],
    trim: true,
  },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
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

const BinModel = mongoose.model("bin", BinSchema);

export default BinModel;
