import mongoose from "mongoose";

const returnOrderSchema = new mongoose.Schema({
  gateNo: {
    type: String,
    required: true,
  },
  employee: {
    name: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
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
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
  level1Approval: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User or relevant model
      ref: "User", // The name of the model you're referencing
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  level2Approval: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User or relevant model
      ref: "User", // The name of the model you're referencing
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  remark: {
    type: String,
    default: null,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const ReturnOrderModel = mongoose.model("returnOrder", returnOrderSchema);

export default ReturnOrderModel;
