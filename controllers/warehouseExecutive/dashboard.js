import ProductionModel from "../../database/schema/warehouseExecutive/production.js";
import catchAsync from "../../utils/errors/catchAsync.js";
import RolesModel from "../../database/schema/roles.schema.js";
import UserModel from "../../database/schema/user.schema.js";

export const GetForkliftTaskCounts = catchAsync(async (req, res) => {
  // Step 1: Find Forklift Operated Role ID
  const forkliftRole = await RolesModel.findOne({
    role_name: "Forklift Operator",
  });
  if (!forkliftRole) {
    return res.status(404).json({
      status: false,
      message: "Forklift Operator role not found",
    });
  }

  // Step 2: Find Users with the Forklift Role ID
  const users = await UserModel.find({ role_id: forkliftRole._id }).select(
    "_id"
  );
  const userIds = users.map((user) => user._id);

  // If no users found, return a response
  if (userIds.length === 0) {
    return res.status(404).json({
      status: false,
      message: "No users with Forklift Operator role found",
    });
  }

  // Step 3: Aggregate task counts by user and status
  const taskCounts = await ProductionModel.aggregate([
    {
      $match: {
        assigned_to: { $in: userIds },
        deleted_at: { $eq: null },
      },
    },
    {
      $group: {
        _id: {
          userId: "$assigned_to",
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.userId",
        pendingCount: {
          $sum: {
            $cond: [{ $eq: ["$_id.status", "Pending"] }, "$count", 0],
          },
        },
        verifiedCount: {
          $sum: {
            $cond: [{ $eq: ["$_id.status", "Verified"] }, "$count", 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users", // Assuming your users collection is named "users"
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        first_name: "$user.first_name",
        last_name: "$user.last_name",
        pendingCount: 1,
        verifiedCount: 1,
      },
    },
  ]);

  // Step 4: Return the results
  res.status(200).json({
    data: taskCounts,
    status: true,
    message: "User task counts retrieved successfully",
  });
});
