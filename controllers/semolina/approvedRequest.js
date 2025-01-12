import catchAsync from "../../utils/errors/catchAsync.js";
import RequestApprovedModel from "../../database/schema/semolina/approvedRequest.js";
import UserModel from "../../database/schema/user.schema.js";
import mongoose from "mongoose";
import ReturnOrderModel from "../../database/schema/semolina/returnOrder.schema.js";

export const UpdateStatus = catchAsync(async (req, res) => {
  try {
    const { id } = req.query;
    const { status, remark } = req.body;
    console.log(id, req.body, "req.body");

    // Step 1: Update the status and remark
    const update = await RequestApprovedModel.findByIdAndUpdate(
      id,
      {
        $set: { status, remarks: remark },
      },
      { new: true } // Return the updated document
    );
    console.log(update, "update");

    res.status(200).json({
      result: update,
      status: true,
      message: "updatingsuccessfully",
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Error updating status", error });
  }
});

export const ListPendingApprove = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
    status,
  } = req.query;

  // Initialize the search query
  let searchQuery = { deleted_at: null };

  // Add search filter if search is provided
  if (search) {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    searchQuery.$or = [{ gateNo: searchRegex }, { approvalLevel: searchRegex }];
  }

  // Fetch user details to check the role and level
  const authUserDetail = req.userDetails;
  const userId = authUserDetail._id;
  const user = await UserModel.findById(userId).populate("role_id");

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  const isAdmin = user?.role_id?.role_name === "Admin";
  const userLevel = user?.level || null;

  // Admins see all data without filters
  if (isAdmin) {
    if (status) searchQuery.status = status;
  } else if (userLevel === "Level 1") {
    // Level 1 users: List all documents based on status
    searchQuery.approvalLevel = "Level 1";
    if (status) searchQuery.status = status;
  } else if (userLevel === "Level 2") {
    // Level 2 users: Show documents only if gateNo has Level 1 approved
    if (status) searchQuery.status = status;

    // Check gateNo documents approved by Level 1
    const level1ApprovedGates = await RequestApprovedModel.distinct("gateNo", {
      approvalLevel: "Level 1",
      status: "Approved", // Only consider Approved Level 1 documents
      deleted_at: null,
    });

    // Add filter to show only Level 2 documents with matching gateNo
    searchQuery.gateNo = { $in: level1ApprovedGates };
    searchQuery.approvalLevel = "Level 2";
  }

  // Calculate pagination
  const totalDocument = await RequestApprovedModel.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.max(1, Math.min(page, totalPages));
  const skip = (validPage - 1) * limit;

  // Aggregation pipeline to fetch the list of approvals
  const approvalList = await RequestApprovedModel.aggregate([
    {
      $match: { ...searchQuery },
    },
    {
      $lookup: {
        from: "users",
        localField: "created_employee_id",
        foreignField: "_id",
        as: "created_employee_id",
        pipeline: [
          { $project: { password: 0 } }, // Exclude sensitive fields
        ],
      },
    },
    {
      $unwind: {
        path: "$created_employee_id",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "approvedBy",
        foreignField: "_id",
        as: "approvedBy",
        pipeline: [
          { $project: { password: 0 } }, // Exclude sensitive fields
        ],
      },
    },
    {
      $unwind: {
        path: "$approvedBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "returnorders",
        localField: "returnOrder_id",
        foreignField: "_id",
        as: "returnOrder_id",
      },
    },
    {
      $unwind: {
        path: "$returnOrder_id",
        preserveNullAndEmptyArrays: true,
      },
    },

    { $sort: { [sortBy]: sort === "desc" ? -1 : 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);
  console.log(approvalList, "approvalList");

  // Response based on approval list
  if (approvalList.length > 0) {
    return res.status(200).json({
      result: approvalList,
      status: true,
      totalPages,
      currentPage: validPage,
      message: `${status || "Pending"} approval list fetched successfully`,
    });
  } else {
    return res.status(404).json({
      status: false,
      message: "No data found",
    });
  }
});

export const GetApproveById = catchAsync(async (req, res) => {
  const { id } = req.query;

  // Validate the ID format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid ID format",
    });
  }
  const ApproveDetails = await ReturnOrderModel.findById(id);
  if (!ApproveDetails) {
    return res.status(404).json({
      status: false,
      message: "Approve not found",
    });
  }

  res.status(200).json({
    result: ApproveDetails,
    status: true,
    message: "Approve details fetched successfully",
  });
});
