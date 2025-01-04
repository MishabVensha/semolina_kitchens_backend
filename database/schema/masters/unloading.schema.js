import mongoose from "mongoose";

const unloadingSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  po: {
    type: String,
  },
  truck_number: {
    type: Number,
  },
  truck_type: {
    type: String,
  },
  lr: {
    type: Number,
  },
  seal: {
    type: String,
  },
  invoice: {
    type: String,
  },
  invoice_value: {
    type: String,
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

const UnLoadingModel = mongoose.model("unLoading", unloadingSchema);

export default UnLoadingModel;
