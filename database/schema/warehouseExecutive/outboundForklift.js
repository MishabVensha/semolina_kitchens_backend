import mongoose from "mongoose";
const outboundForkliftModel = new mongoose.Schema({
  order_qty: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  order_number: {
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
  order_type: {
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
  bin: {
    type: String,
    trim: true,
    default: null,
  },
  assigned_to: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
 
  customerDetails: {
    type: String,
    trim: true,
    default: null,
  },
 
  date: {
    type: String,
    trim: true,
    default: null,
  },
  digit_3_codes: {
    type: String,
    trim: true,
    default: null,
  },
  batch: {
    type: String,
    trim: true,
    default: null,
  },
  status: { type: String, default: "Pending" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const OutboundForkliftModel = mongoose.model("outboundForkliftModel", outboundForkliftModel);

export default OutboundForkliftModel;

