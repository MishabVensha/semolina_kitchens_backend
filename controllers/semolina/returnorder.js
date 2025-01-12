import mongoose from "mongoose";
import ReturnOrderModel from "../../database/schema/semolina/returnOrder.schema.js";
import UserModel from "../../database/schema/user.schema.js";
import catchAsync from "../../utils/errors/catchAsync.js";
import RequestApprovedModel from "../../database/schema/semolina/approvedRequest.js";

function generateRandomGateNo() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "GATE-";
  const length = 8; // You can adjust the length of the random part

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export const addReturn = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const createdEmployeeId = authUserDetail._id;
  console.log(req.body, "req.body");

  const { level1, level2, employee_id, employee_name, ...otherData } = req.body;
  const gateNo = generateRandomGateNo();

  // Prepare the return order data
  const returnData = {
    ...otherData,
    gateNo,
    created_employee_id: createdEmployeeId,
    level1Approval: {
      approvedBy: level1 || null,
      status: "Pending",
    },
    employee: {
      name: employee_name,
      employeeId: employee_id,
    },
    level2Approval: {
      approvedBy: level2 || null,
      status: "Pending",
    },
  };

  // Save the return order
  const newReturn = new ReturnOrderModel(returnData);
  const savedReturn = await newReturn.save();

  // Create separate documents for each approval level in RequestApprovedModel
  const requestApprovedDocs = [];

  if (level1) {
    requestApprovedDocs.push({
      returnOrder_id: savedReturn._id,
      gateNo,
      approvedBy: level1,
      status: "Pending",
      created_employee_id: createdEmployeeId,
      approvalLevel: "Level 1",
    });
  }

  if (level2) {
    requestApprovedDocs.push({
      returnOrder_id: savedReturn._id,
      gateNo,
      approvedBy: level2,
      status: "Pending",
      created_employee_id: createdEmployeeId,
      approvalLevel: "Level 2",
    });
  }

  // Save all documents to the RequestApprovedModel
  if (requestApprovedDocs.length > 0) {
    await RequestApprovedModel.insertMany(requestApprovedDocs);
  }

  // Response
  return res.status(201).json({
    result: savedReturn,
    status: true,
    message: "Return created successfully with approvals",
  });
});

export const UpdateReturnOrder = catchAsync(async (req, res) => {
  const id = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(uomId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid uom ID",
    });
  }
  const order = await ReturnOrderModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!order) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "order not found.",
    });
  }
  res.status(200).json({
    result: order,
    status: true,
    message: "Updated successfully",
  });
});

export const ListReturnOrder = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
  } = req.query;

  let searchQuery = { deleted_at: null };
  if (search) {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    searchQuery = {
      ...searchQuery,
      $or: [
        { production_line_name: searchRegex },
        { production_line_description: searchRegex },
      ],
    };
  }
  const totalDocument = await ReturnOrderModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const uomList = await ReturnOrderModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "created_employee_id",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              password: 0,
            },
          },
        ],
        as: "created_employee_id",
      },
    },
    {
      $unwind: {
        path: "$created_employee_id",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: { ...searchQuery },
    },
    {
      $sort: { [sortBy]: sort == "desc" ? -1 : 1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
  if (uomList) {
    return res.status(200).json({
      result: uomList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Uom List",
    });
  }
});

export const ListEmployeesByLevel = catchAsync(async (req, res) => {
  const { level } = req.query; // Level passed from the frontend

  // Validate if the level is provided
  if (!level) {
    return res.status(400).json({
      status: false,
      message: "Level is required",
    });
  }

  try {
    // Fetch employees based on the provided level
    const employees = await UserModel.aggregate([
      {
        $match: { level: level, deleted_at: null }, // Match level and ensure not deleted
      },
      {
        $project: {
          name: { $concat: ["$first_name", " ", "$last_name"] }, // Concatenate first and last name
          level: 1, // Include level in the response
          _id: 1,
        },
      },
    ]);

    // Return the response
    return res.status(200).json({
      status: true,
      data: employees,
      message: `Employees with level: ${level}`,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching employees.",
      error: error.message,
    });
  }
});
