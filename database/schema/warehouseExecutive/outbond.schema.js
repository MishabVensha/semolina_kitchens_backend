import mongoose from "mongoose";

const outboundSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "Date is required."],
  },
  order_type: {
    type: String,
    trim: true,
  },
  sales_order_no: {
    type: String,
    trim: true,
  },
  sales_transfer_order_no: {
    type: String,
    trim: true,
  },
  returnable_no: {
    type: String,
    trim: true,
  },
  consignment_no: {
    type: String,
    trim: true,
  },
  customer_name: {
    type: String,
    trim: true,
  },
  customer_code: {
    type: String,
    trim: true,
  },
  customer_address: {
    type: String,
    trim: true,
  },
  bill_to_code: {
    type: String,
    trim: true,
  },
  bill_to_address: {
    type: String,
    trim: true,
  },
  ship_to_code: {
    type: String,
    trim: true,
  },
  ship_to_address: {
    type: String,
    trim: true,
  },
  plant_name: {
    type: String,
    trim: true,
  },
  plant_address: {
    type: String,
    trim: true,
  },
  route_no: {
    type: String,
    trim: true,
  },
  others: {
    type: String,
    trim: true,
  },
  skus: [
    {
      sku_code: {
        type: String,
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
      stock_qty: {
        type: String,
        trim: true,
      },
    },
  ],
  totalStockQty: {
    type: Number,
    default: 0,
  },
  totalSkuCount: {
    type: Number,
    default: 0,
  },
  batch: {
    type: String,
    trim: true,
    default: null,
  },
  status: {
    type: String,
    default: "Pending",
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

const OutboundModel = mongoose.model("outbound", outboundSchema);

export default OutboundModel;
