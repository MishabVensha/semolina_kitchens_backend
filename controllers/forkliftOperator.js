import mongoose from "mongoose";
import RolesModel from "../database/schema/roles.schema.js";
import { create, generateRandomPassword } from "../utils/authServices/index.js";
import catchAsync from "../utils/errors/catchAsync.js";
import { IdRequired } from "../utils/response/response.js";

import ProductionModel from "../database/schema/warehouseExecutive/production.js";
import OutboundForkliftModel from "../database/schema/warehouseExecutive/outboundForklift.js";
import UserModel from "../database/schema/user.schema.js";
import MaterialModel from "../database/schema/masters/materials.schema.js";

export const AddForkliftOperator = catchAsync(async (req, res) => {
  const authForkliftOperatorDetail = req.forkliftOperatorDetails;
  const password = generateRandomPassword(8);
  const hashedPassword = await create(password);
  const forkliftOperatorData = {
    ...req.body,
    created_employee_id: authForkliftOperatorDetail._id,
    password: hashedPassword,
  };

  const isRoleActive = await RolesModel.findById(forkliftOperatorData?.role_id);

  if (isRoleActive.status == false) {
    return res.status(400).json({
      result: [],
      status: true,
      message: "Role is Inactive",
    });
  }

  const newForkliftOperator = new ProductionModel(forkliftOperatorData);
  const savedForkliftOperator = await newForkliftOperator.save();

  return res.status(201).json({
    result: savedForkliftOperator,
    status: true,
    message: "ForkliftOperator created successfully",
  });
});

export const UpdateForkliftOperator = catchAsync(async (req, res) => {
  const forkliftOperatorId = req.query.id;
  if (
    !forkliftOperatorId ||
    !mongoose.Types.ObjectId.isValid(forkliftOperatorId)
  ) {
    return res.status(400).json({
      result: [],
      status: false,
      message: forkliftOperatorId ? "Invalid forkliftOperator ID" : IdRequired,
    });
  }
  const requiredFields = [
    "employee_id",
    "first_name",
    "last_name",
    "email_id",
    "role_name",
  ];

  for (const field of requiredFields) {
    if (req.body[field] === "") {
      return res.status(400).json({
        result: [],
        status: false,
        message: `${field} should not be empty.`,
      });
    }
  }
  const updateData = { ...req.body };
  const forkliftOperator = await ProductionModel.findByIdAndUpdate(
    forkliftOperatorId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!forkliftOperator) {
    return res.status(404).json({
      status: false,
      message: "ForkliftOperator not found.",
    });
  }

  res.status(200).json({
    result: forkliftOperator,
    status: true,
    message: "ForkliftOperator updated successfully",
  });
});

export const ListDistinctForkliftOperatorTask = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
  } = req.query;
  const authUserDetail = req.userDetails;
  const userId = authUserDetail._id; // Get the authenticated user's ID

  // Fetch user and their role details
  const user = await UserModel.findOne({ _id: userId }).populate("role_id"); // Assuming 'role' is a reference field
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }
  console.log(user, "user");

  const isAdmin = user.role_id.role_name === "Admin"; // Adjust based on how you store and reference roles

  // Define the base query
  let searchQuery = { deleted_at: null };

  // If the user is not an admin, filter by the authenticated user's ID
  if (!isAdmin) {
    searchQuery = { ...searchQuery, assigned_to: userId };
  }

  if (search) {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    searchQuery = {
      ...searchQuery,
      $or: [
        { production_line: searchRegex },
        { sku_code: searchRegex },
        { sut: searchRegex },
        { status: searchRegex },
        { batch: searchRegex },
        { bin: searchRegex },
      ],
    };
  }

  const totalDocument = await ProductionModel.countDocuments({
    ...searchQuery,
    bin: { $ne: null },
    status: { $in: ["Allocated"] },
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const produntionLineList = await ProductionModel.aggregate([
    {
      $match: {
        ...searchQuery,
        bin: { $ne: null },
        status: { $in: ["Allocated"] },
      },
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
    {
      $lookup: {
        from: "users", // The name of the User collection
        localField: "assigned_to", // The field in ProductionModel to match
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
    {
      $lookup: {
        from: "production_lines", // The name of the ProductLine collection
        localField: "production_line", // The field in ProductionModel to match
        foreignField: "_id", // The field in the ProductLine collection to match
        as: "production_line_details", // The name of the field to add the matched documents
      },
    },
    {
      $unwind: {
        path: "$production_line_details",
        preserveNullAndEmptyArrays: true, // Preserves the document if no match is found
      },
    },
  ]);

  if (produntionLineList) {
    return res.status(200).json({
      result: produntionLineList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All ProductionLine List",
    });
  }
});
export const ListDistinctForkliftOperatorTaskOutbound = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
  } = req.query;
  const authUserDetail = req.userDetails;
  const userId = authUserDetail._id; // Get the authenticated user's ID

  // Fetch user and their role details
  const user = await UserModel.findOne({ _id: userId }).populate("role_id");
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  const isAdmin = user.role_id.role_name === "Admin";

      let searchQuery = { deleted_at: null };

      if (!isAdmin) {
      searchQuery = { ...searchQuery, assigned_to: userId };
    }

    if (search) {
      const searchRegex = new RegExp(".*" + search + ".*", "i");
      searchQuery = {
        ...searchQuery,
        $or: [
          { production_Line: searchRegex },
          { sku_code: searchRegex },
          { sut: searchRegex },
          { status: searchRegex },
          { batch: searchRegex },
          { bin: searchRegex },
        ],
      };
    }

    const totalDocument = await OutboundForkliftModel.countDocuments({
      ...searchQuery,
      bin: { $ne: null },
      status: { $ne: "Verified" },
    });
    const totalPages = Math.ceil(totalDocument / limit);
    const validPage = Math.min(Math.max(page, 1), totalPages);
    const skip = Math.max((validPage - 1) * limit, 0);

    let produntionLineList = await OutboundForkliftModel.aggregate([
      {
        $match: {
          ...searchQuery,
          bin: { $ne: null },
          status: { $ne: "Verified" },
        },
      },
      {
        $sort: { [sortBy]: sort === "desc" ? -1 : 1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "_id",
          as: "assigned_user",
        },
      },
      {
        $unwind: {
          path: "$assigned_user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "production_lines",
          localField: "production_line",
          foreignField: "_id",
          as: "production_line_details",
        },
      },
      {
        $unwind: {
          path: "$production_line_details",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
 
  // Loop through the results to fetch pallet_qty from MaterialMasterModel based on sku_code
  produntionLineList = await Promise.all(
    produntionLineList.map(async (item) => {
      const { sku_code, order_qty } = item;

      // Fetch pallet_qty from MaterialMasterModel based on sku_code
      const materialMaster = await MaterialModel.findOne({ sku_code });

      if (!materialMaster) return item; // Skip if no material master data is found

      const { pallet_qty } = materialMaster;

      const fullPallets = Math.floor(order_qty / pallet_qty);
      const remainderQty = order_qty % pallet_qty;

      let entries = [];

      // Generate full pallet entries
      for (let i = 0; i < fullPallets; i++) {
        entries.push({ ...item, quantity: pallet_qty });
      }

      // Generate remainder entry
      if (remainderQty > 0) {
        entries.push({ ...item, quantity: remainderQty });
      }

      return entries;
    })
  );

  // Flatten the list of entries
  produntionLineList = produntionLineList.flat();
   console.log(" produntionLineList",  produntionLineList);;
    if (produntionLineList.length) {
      return res.status(200).json({
        result: produntionLineList,
        status: true,
        totalPages,
        currentPage: validPage,
        message: "All ProductionLine List",
      });
    } else {
    return res.status(404).json({
      status: false,
      message: "No ProductionLine found",
    });
  }
});



