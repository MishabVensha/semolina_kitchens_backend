import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import returnOrderModel from "../../database/schema/semolina/returnOrder.schema.js";

export const approve= catchAsync( async (req, res) => {
    try {
      const { id } = req.params;
      const { level, status, approvedBy, remark } = req.body;
  
      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
  
      const order = await returnOrderModel.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      if (level === 1 && order.level1Approval.status === "Pending") {
        order.level1Approval.status = status;
        order.level1Approval.approvedBy = approvedBy;
        order.level1Approval.approvedAt = new Date();
        order.level1Approval.remark = status === "Rejected" ? remark : null;
      } else if (
        level === 2 &&
        order.level1Approval.status === "Approved" &&
        order.level2Approval.status === "Pending"
      ) {
        order.level2Approval.status = status;
        order.level2Approval.approvedBy = approvedBy;
        order.level2Approval.approvedAt = new Date();
        order.level2Approval.remark = status === "Rejected" ? remark : null;
      } else {
        return res.status(400).json({ message: "Invalid approval sequence or already processed" });
      }
  
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Error updating approval status", error });
    }
  });