import mongoose from "mongoose";
const StockReportSchema = new mongoose.Schema({
 
    production_line: {
        type: mongoose.Types.ObjectId,
        ref: "production_lines",
        required: true,
        trim: true,
      },
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
      assigned_to: {
        type: mongoose.Types.ObjectId,
        ref: "users",
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
      digit_3_codes: {
        type: String,
        trim: true,
        default: null,
      },
      status: { type: String, default: "Pending" },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
      deleted_at: { type: Date, default: null },
});

const StockReportModel = mongoose.model("stockReport", StockReportSchema);

export default StockReportModel;