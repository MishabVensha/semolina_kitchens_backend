import { Schema, model } from "mongoose";

const binSchema = new Schema({
  storage_type: {
    type: String,
    required: true,
  },
  storage_section: {
    type: String,
    minlength: 1,
    maxlength: 25,
    required: true,
    trim: true,
  },
  bin_no: {
    type: String,
    minlength: 1,
    maxlength: 25,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: null,
  },
  bin_capacity: {
    type: Number,
    trim: true,
    default: 0,
  },
  digit_3_codes: {
    type: String,
    trim: true,
    default: null,
  },
  inbound_transfer_order: {
    type: Number,
    trim: true,
    default: null,
  },
  batch: {
    type: String,
    trim: true,
    default: null,
  },
  sku_code: {
    type: String,
    trim: true,
    default: null,
  },

  outbound_transfer_order: {
    type: String,
    trim: true,
    default: null,
  },
  available_capacity: {
    type: Number,
    trim: true,
    default: 0,
  },
  status: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const BinSModel = model("BinTable", binSchema);
export default BinSModel;
