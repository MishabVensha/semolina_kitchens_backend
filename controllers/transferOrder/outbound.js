import UserModel from "../../database/schema/user.schema.js";
import OutboundTransactionModel from "../../database/schema/warehouseExecutive/production.js";
import catchAsync from "../../utils/errors/catchAsync.js";

export const ListInboundTransactionOutbond = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
  } = req.query;
  const authUserDetail = req.userDetails;
  const userId = authUserDetail._id;

  const user = await UserModel.findOne({ _id: userId }).populate("role_id");
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  const isAdmin = user.role_id.role_name === "Admin";
  let searchQuery = { deleted_at: null, status: "Pending" };

  if (!isAdmin) {
    searchQuery = {
      ...searchQuery,
      created_employee_id: userId,
    };
  }

  if (search) {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    searchQuery = {
      ...searchQuery,
      $or: [
        { sku_code: searchRegex },
        { sut: searchRegex },
        { status: searchRegex },
        { batch: searchRegex },
        { bin: searchRegex },
      ],
    };
  }

  const totalDocument = await OutboundTransactionModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const list = await OutboundTransactionModel.aggregate([
    {
      $match: { ...searchQuery },
    },
    {
      $sort: {
        [sortBy]: sort === "desc" ? -1 : 1,
        ["transfer_order"]: sort === "desc" ? -1 : 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users", // The name of the User collection
        localField: "assigned_to", // The field in OutboundTransactionModel to match
        foreignField: "_id", // The field in the User collection to match
        as: "assigned_user", // The name of the field to add the matched documents
      },
    },
    {
      $unwind: {
        path: "$assigned_user",
        preserveNullAndEmptyArrays: true, // Preserves the document if no match is found
      },
    },
  ]);

  if (list) {
    return res.status(200).json({
      result: list,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All List",
    });
  }
});
