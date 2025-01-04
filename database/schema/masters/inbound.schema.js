import mongoose from "mongoose";

const InboundSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "Date is required."],
  },
  lr_number: {
    type: String,
    required: [true, "LR Number is required."],
    trim: true,
  },
  truck_number: {
    type: String,
    required: [true, "Truck Number is required."],
    trim: true,
  },
  truck_type: {
    type: String,
    // enum: ['Small', 'Medium', 'Large'], // Example types, adjust as needed
    default: "Select",
  },
  from_vendor: {
    type: String,
    required: true,
    // enum: ['Vendor1', 'Vendor2', 'Vendor3'], // Example vendors, adjust as needed
    default: "Select",
  },
  customer_name: {
    type: String,
    required: true,
    // default: "Select",
    trim: true,
  },
  po_number: {
    type: String,
    default: "",
    trim: true,
  },
  invoice_number: {
    type: String,
    default: "",
    trim: true,
  },
  invoice_qty: {
    type: Number,
    default: 0,
  },
  invoice_value: {
    type: Number,
    default: 0,
  },
  eway_bill_number: {
    type: String,
    default: "",
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

const InboundModel = mongoose.model("inbound", InboundSchema);

export default InboundModel;
