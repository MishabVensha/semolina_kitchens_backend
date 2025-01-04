import mongoose from "mongoose";

const BinTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Type is required."],
    trim: true,
  },
  allowed_uom: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uoms",
      required: [true, "Allowed UOM is required."],
    },
  ],

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

const BinTypeModel = mongoose.model("bintype", BinTypeSchema);

export default BinTypeModel;
