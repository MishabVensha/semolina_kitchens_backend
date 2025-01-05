import mongoose from "mongoose";

const returnOrderSchema = new mongoose.Schema({
  gateNo: {
    type: String,
    required: false,
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
  materialDetails: [
    {
      skuCode: {
        type: String,
        required: true,
      },
      skuDescription: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  createdBy: {
    type: String,
    required: true,
  },
  level1Approval: {
    approvedBy: {
      type: String,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    remark: {
      type: String,
      default: null,
    },
  },
  level2Approval: {
    approvedBy: {
      type: String,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    remark: {
      type: String,
      default: null,
    },
  },
}, {
  timestamps: true,
});

const returnOrderModel = mongoose.model("returnOrder", returnOrderSchema);

export default returnOrderModel;

