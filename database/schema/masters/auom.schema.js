import mongoose from "mongoose";
const AuomSchema = new mongoose.Schema({
  uom_details: [
    {
      sku_code: {
        type: String,
        required: [true, "SKU Code is required."],
        trim: true,
      },
      auom: {
        type: String,
        required: [true, "Auom is required."],
        trim: true,
      },
      unit: {
        type: String,
        required: [true, "Unit is required."],
        trim: true,
      },
      convention_uom: {
        type: String,
        required: [true, "Convention uom is required."],
        trim: true,
      },
      base_uom: {
        type: String,
        required: [true, "Base Uom is required."],
        trim: true,
      },
    },
  ],
  sku_code: {
    type: String,
    required: [true, "SKU Code is required."],
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

const AuomModel = mongoose.model("auom", AuomSchema);

export default AuomModel;
