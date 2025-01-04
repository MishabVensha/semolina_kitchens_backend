import mongoose from "mongoose";
const stockSchema = new mongoose.Schema({
  process_order_qty: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  process_order: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  sku_code: {
    type: String,
    required: true,
    trim: true,
  },
  sku_description: {
    type: String,
    trim: true,
  },
  sut: {
    type: String,
    trim: true,
  },
  uom: {
    type: String,
    trim: true,
  },
  transfer_order: {
    type: Number,
    trim: true,
    default: 0,
  },
  pallet_qty: {
    type: Number,
    trim: true,
    default: 0,
  },
  bin: {
    type: String,
    trim: true,
    default: null,
  },
  bin_id: {
    type: mongoose.Types.ObjectId,
    ref: "bins",
    default: null,
    trim: true,
  },
  assigned_to: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
  last_pallate_status: {
    type: Boolean,
    trim: true,
    default: false,
  },
  over_flow_status: {
    type: Boolean,
    trim: true,
    default: false,
  },

  material_id: {
    type: mongoose.Types.ObjectId,
    ref: "materials",
    required: true,
    trim: true,
  },
  batch: {
    type: String,
    trim: true,
    default: null,
  },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },

  date: {
    type: String,
    trim: true,
    default: null,
  },
  confirm_date: {
    type: String,
    trim: true,
    default: null,
  },
  digit_3_codes: {
    type: String,
    trim: true,
    default: null,
  },
  transaction_type: {
    type: String,
    trim: true,
    default: null,
  },
  status: { type: String, default: "Verified" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const StockModel = mongoose.model("stock", stockSchema);

export default StockModel;
