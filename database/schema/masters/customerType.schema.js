import mongoose from "mongoose";

const customerTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Type is required."],
    trim: true,
    unique: [true, "Type already exist."],
  },
  discount: {
    type: String,
    required: [true, "Discount is required."],
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

const CustomerTypeModel = mongoose.model("customertype", customerTypeSchema);

export default CustomerTypeModel;
