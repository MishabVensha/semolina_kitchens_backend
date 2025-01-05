import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import returnOrderModel from "../../database/schema/semolina/returnOrder.schema.js";


export const addReturn = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const returnData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newReturn = new returnOrderModel(returnData);
  const savedReturn = await newReturn.save();
  return res.status(201).json({
    result: savedReturn,
    status: true,
    message: "Return created successfully",
  });
});

export const listReturns = catchAsync(async (req, res) => {
  // Retrieve query parameters for filtering, pagination, etc.
  const { page = 1, limit = 10, sort = "-createdAt", ...filters } = req.query;

  // Build query conditions based on filters
  const query = { ...filters }; // Adjust as needed for filtering

  // Convert page and limit to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Fetch data from the database with pagination and sorting
  const returns = await returnOrderModel
    .find(query) // Apply filters
    .sort(sort) // Apply sorting
    .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
    .limit(limitNumber); // Limit the number of documents

  // Get total count for pagination
  const total = await returnOrderModel.countDocuments(query);

  // Return the results
  return res.status(200).json({
    status: true,
    message: "Returns fetched successfully",
    data: {
      total,
      page: pageNumber,
      limit: limitNumber,
      results: returns,
    },
  });
});


export const updateReturn = catchAsync(async (req, res) => {
  const { id } = req.params; // Extract return order ID from URL params
  const updateData = req.body; // Data to update

  // Find and update the return order
  const updatedReturn = await returnOrderModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true } // Return the updated document and validate the fields
  );

  if (!updatedReturn) {
    return res.status(404).json({
      status: false,
      message: "Return order not found",
    });
  }

  return res.status(200).json({
    result: updatedReturn,
    status: true,
    message: "Return order updated successfully",
  });
});

export const deleteReturn = catchAsync(async (req, res) => {
  const { id } = req.params; // Extract return order ID from URL params

  // Find and delete the return order
  const deletedReturn = await returnOrderModel.findByIdAndDelete(id);

  if (!deletedReturn) {
    return res.status(404).json({
      status: false,
      message: "Return order not found",
    });
  }

  return res.status(200).json({
    result: deletedReturn,
    status: true,
    message: "Return order deleted successfully",
  });
});




  