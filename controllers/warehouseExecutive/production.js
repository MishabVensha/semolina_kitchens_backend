import mongoose from "mongoose";
import XLSX from "xlsx";
import BinModel from "../../database/schema/masters/bin.schema.js";
import MaterialModel from "../../database/schema/masters/materials.schema.js";
import UserModel from "../../database/schema/user.schema.js";
import ProductionModel from "../../database/schema/warehouseExecutive/production.js";
import catchAsync from "../../utils/errors/catchAsync.js";
import StockModel from "../../database/schema/stock/stock.schema.js";
import OutboundForkliftModel from "../../database/schema/warehouseExecutive/outboundForklift.js";
import InboundTransactionModel from "../../database/schema/TransactionTable/inboundTransaction.js";

export const BulkUploadProduction = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file || !file.path) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "No file uploaded or file path not found.",
    });
  }

  const session = await ProductionModel.startSession();
  session.startTransaction();

  try {
    const workbook = XLSX.readFile(file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      dateNF: "dd-mm-yyyy",
      raw: false,
    });
    // console.log(data, "data");

    if (data.length === 0) {
      return res.status(400).json({
        result: [],
        status: false,
        message: "No items found in the uploaded file.",
      });
    }
    await ProductionModel.insertMany(data, {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      result: [],
      status: true,
      message: "Pallet Bulk uploaded successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const BulkUploadBin = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file || !file.path) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "No file uploaded or file path not found.",
    });
  }

  const session = await BinModel.startSession();
  session.startTransaction();

  try {
    const workbook = XLSX.readFile(file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      dateNF: "dd-mm-yyyy",
      raw: false,
    });
    console.log(data, "data");

    if (data.length === 0) {
      return res.status(400).json({
        result: [],
        status: false,
        message: "No items found in the uploaded file.",
      });
    }
    await BinModel.insertMany(data, {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      result: [],
      status: true,
      message: "Bin Bulk uploaded successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const ListProduntion = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
  } = req.query;
  // console.log(search);
  const authUserDetail = req.userDetails;
  const userId = authUserDetail._id;

  // Fetch user and their role details
  const user = await UserModel.findOne({ _id: userId }).populate("role_id"); // Assuming 'role' is a reference field
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  const isAdmin = user.role_id.role_name === "Admin"; // Adjust based on how you store and reference roles
  let searchQuery = { deleted_at: null, status: "Pending" };

  // If the user is not an admin, filter by the authenticated user's ID
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

  const totalDocument = await ProductionModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const produntionLineList = await ProductionModel.aggregate([
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
        from: "productionlines", // The name of the ProductLine collection
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
      message: "All ProduntionLine List",
    });
  }
});

export const FetchSkuDetails = catchAsync(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      status: "fail",
      message: 'Query parameter "q" is required',
    });
  }

  try {
    // Find SKUs matching the query
    const skus = await MaterialModel.find({
      $or: [
        { sku_code: new RegExp(q, "i") }, // Case-insensitive search for sku_code
        { sku_description: new RegExp(q, "i") }, // Case-insensitive search for sku_description
      ],
    }).limit(10); // Limit results for performance

    // Extract unique SKU codes
    // const matchedSkuCodes = [...new Set(skus.map((sku) => sku.sku_code))];

    // console.log(skus, "matchedSkuCodes");

    return res.status(200).json({
      status: "success",
      data: skus, // Return only the array of matched SKU codes
      message: "List",
    });
  } catch (error) {
    console.error("Error fetching SKUs:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching SKUs",
    });
  }
});

export const FetchAllSkuDetails = catchAsync(async (req, res) => {
  const { sku_code } = req.query;

  try {
    if (!sku_code) {
      return res.status(400).json({
        status: false,
        message: "sku_code query parameter is required",
      });
    }

    // Use aggregation to get unique sku_code, sku_decr, and sut
    const result = await MaterialModel.aggregate([
      {
        $match: {
          $or: [{ sku_code: sku_code }, { sku_description: sku_code }],
        },
      },
      {
        $group: {
          _id: "$sku_code",
          uniqueSkuDecrs: { $addToSet: "$sku_description" },
          uniqueSuts: { $addToSet: "$sut" },
        },
      },
      {
        $project: {
          _id: 0,
          uniqueSkuCodes: "$_id",
          uniqueSkuDecrs: 1,
          uniqueSuts: 1,
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No records found",
      });
    }

    const { uniqueSkuCodes, uniqueSkuDecrs, uniqueSuts } = result[0];

    return res.status(200).json({
      status: true,
      data: {
        uniqueSkuCodes: [uniqueSkuCodes],
        uniqueSkuDecrs: uniqueSkuDecrs,
        uniqueSuts: uniqueSuts,
      },
      message: "List",
    });
  } catch (error) {
    console.error("Error fetching SKUs:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching SKUs",
    });
  }
});

export const AddProduction = catchAsync(async (req, res) => {
  try {
    const {
      process_order_qty,
      process_order,
      production_line,
      pallet_qty,
      assigned_to,
    } = req.body;
    const combinationExists = await ProductionModel.exists({
      production_line: production_line,
      process_order: process_order,
    });

    if (combinationExists) {
      return res.status(400).json({
        result: [],
        status: false,
        message: "Production line and process order already exists",
      });
    }

    const authUserDetail = req.userDetails;
    // Ensure correct types
    const processOrderQty = Number(process_order_qty);
    const palletQty = Number(pallet_qty);

    if (isNaN(processOrderQty) || isNaN(palletQty)) {
      return res.status(400).json({
        status: false,
        message: "Invalid quantity values provided",
      });
    }

    // Calculate the number of full pallets and the remaining quantity
    const fullPalletsCount = Math.floor(processOrderQty / palletQty);
    const remainingQty = processOrderQty % palletQty;

    // Get the latest transfer order number from the database
    const latestProduction = await ProductionModel.findOne().sort({
      transfer_order: -1,
    });
    const startingTransferOrderNo = latestProduction
      ? latestProduction.transfer_order + 1
      : 1;

    // Determine how many assigned_to IDs are available
    const assignedToCount = assigned_to.length;

    // console.log("Assigned To IDs:", assigned_to);

    // Create production entries for the full pallets
    const productionEntries = [];

    // Determine how many production entries to create (full pallets + possibly one more for remaining quantity)
    const totalEntries = fullPalletsCount + (remainingQty > 0 ? 1 : 0);

    for (let i = 0; i < totalEntries; i++) {
      // Calculate the pallet quantity for the current entry
      const currentPalletQty = i < fullPalletsCount ? palletQty : remainingQty;

      // Calculate the assigned_to index (looping if there are more entries than assigned_to IDs)
      const assignedToIndex = i % assignedToCount;

      productionEntries.push({
        ...req.body,
        pallet_qty: currentPalletQty,
        created_employee_id: authUserDetail._id,
        transfer_order: startingTransferOrderNo + i,
        assigned_to: assigned_to[assignedToIndex],
        transaction_type: "inbound",
      });
    }

    // Save all production entries to the database
    const savedProductions = await ProductionModel.insertMany(
      productionEntries
    );
    await InboundTransactionModel.insertMany(productionEntries);

    return res.status(201).json({
      result: savedProductions,
      status: true,
      message: "Production entries created successfully",
    });
  } catch (error) {
    console.error("Error creating production entries:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating production entries",
      error: error.message,
    });
  }
});

export const ListBin = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
  } = req.query;

  var searchQuery = { deleted_at: null };
  if (search) {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    searchQuery = {
      ...searchQuery,
      $or: [
        { storage_type: searchRegex },
        { bin_no: searchRegex },
        {
          digit_3_codes: searchRegex,
        },
        { status: searchRegex },

        { batch: searchRegex },
        { sku_code: searchRegex },
      ],
    };
  }
  const totalDocument = await BinModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const BinList = await BinModel.aggregate([
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
  if (BinList) {
    return res.status(200).json({
      result: BinList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Bin List",
    });
  }
});

// export const AllocateBin = catchAsync(async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const transferOrderIds = req.body.item_details.map((item) => item._id);
//     const transferOrders = await ProductionModel.find({
//       _id: { $in: transferOrderIds },
//     }).session(session);
//     let bins = await BinModel.find({ status: { $ne: "No Available" } }).session(
//       session
//     );

//     const binAllocations = {};
//     const notAvailableBins = [];

//     const allocateToBin = (bin, transferOrder) => {
//       const binKey = `${bin._id}`;

//       if (bin.available_capacity >= transferOrder.pallet_qty) {
//         if (!binAllocations[binKey]) {
//           binAllocations[binKey] = {
//             bin,
//             transferOrders: [],
//             allocatedQty: 0,
//             digit_3_codes: bin.digit_3_codes,
//             bin_no: bin.bin_no,
//           };
//         }
//         binAllocations[binKey].transferOrders.push(transferOrder._id);
//         binAllocations[binKey].allocatedQty += transferOrder.pallet_qty;
//         bin.available_capacity -= transferOrder.pallet_qty;
//       } else {
//         notAvailableBins.push({
//           sku_code: transferOrder.sku_code,
//           batch: transferOrder.batch,
//           pallet_qty: transferOrder.pallet_qty,
//           binId: bin._id,
//         });
//       }
//     };

//     transferOrders.forEach((order) => {
//       let allocated = false;

//       bins.forEach((bin) => {
//         if (
//           bin.available_capacity > 0 &&
//           bin.available_capacity <= bin.bin_capacity &&
//           bin.sku_code === order.sku_code &&
//           bin.batch === order.batch
//         ) {
//           allocateToBin(bin, order);
//           allocated = true;
//         } else if (
//           bin.available_capacity >= order.pallet_qty &&
//           bin.sku_code === order.sku_code &&
//           bin.batch === order.batch
//         ) {
//           allocateToBin(bin, order);
//           allocated = true;
//         }
//       });

//       if (!allocated) {
//         notAvailableBins.push({
//           sku_code: order.sku_code,
//           batch: order.batch,
//           pallet_qty: order.pallet_qty,
//         });
//       }
//     });

//     if (notAvailableBins.length > 0) {
//       await session.abortTransaction();
//       session.endSession();

//       const message = `Bins are not available for the required pallet quantity:\n${notAvailableBins
//         .map(
//           (bin) =>
//             `SKU Code: ${bin.sku_code}, Batch: ${bin.batch}, Pallet Qty: ${bin.pallet_qty}`
//         )
//         .join("\n")}`;

//       return res.status(400).json({
//         status: false,
//         message: message,
//         result: notAvailableBins,
//       });
//     }

//     const binUpdates = Object.values(binAllocations).map(async (allocation) => {
//       const bin = allocation.bin;
//       const transferOrderIds = allocation.transferOrders;

//       const newStatus =
//         bin.available_capacity === 0
//           ? "No Available"
//           : bin.available_capacity <= bin.bin_capacity
//           ? "Partial Available"
//           : "Available";

//       await BinModel.updateOne(
//         { _id: bin._id },
//         {
//           available_capacity: bin.available_capacity,
//           status: newStatus,
//         },
//         { session }
//       );

//       await ProductionModel.updateMany(
//         { _id: { $in: transferOrderIds } },
//         {
//           bin: allocation.bin_no,
//           status: "Allocated",
//           digit_3_codes: allocation.digit_3_codes,
//         },
//         { session }
//       );
//     });

//     await Promise.all(binUpdates);

//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({
//       status: true,
//       message: "Bins allocated successfully",
//       result: Object.values(binAllocations),
//     });
//   } catch (err) {
//     console.error("Error allocating bins:", err);
//     if (session.inTransaction()) {
//       await session.abortTransaction();
//     }
//     session.endSession();
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// });

export const VerifyBin = catchAsync(async (req, res) => {
  try {
    // Extracting digit_3_codes and _id from the request body
    const { digit_3_codes, _id } = req.body;
    console.log(digit_3_codes, _id);

    // Fetching the document by _id
    const production = await ProductionModel.findById(_id);
    if (!production) {
      return res.status(404).json({
        status: false,
        message: "Bin not found",
      });
    }
    // Checking if the provided digit_3_codes matches the one in the database
    if (production.digit_3_codes === digit_3_codes) {
      const now = new Date();
      const formattedDateTime = now.toISOString();
      production.confirm_date = formattedDateTime;
      production.status = "Verified"; // Update with your actual field name for status
      await production.save();
      const authUserDetail = req.userDetails;
      const newStockEntry = new StockModel({
        process_order_qty: production.process_order_qty,
        process_order: production.process_order,
        sku_code: production.sku_code,
        sku_description: production.sku_description,
        sut: production.sut,
        uom: production.uom,
        transfer_order: production.transfer_order,
        pallet_qty: production.pallet_qty,
        bin: production.bin,
        bin_id: production.bin_id,
        assigned_to: production.assigned_to,
        last_pallate_status: production.last_pallate_status,
        over_flow_status: production.over_flow_status,
        material_id: production.material_id,
        batch: production.batch,
        created_employee_id: authUserDetail._id,
        date: production.date,
        confirm_date: formattedDateTime,
        digit_3_codes: production.digit_3_codes,
        transaction_type: production.transaction_type,
      });

      await newStockEntry.save();

      await newStockEntry.save();
      return res.status(200).json({
        status: true,
        message: "Digit codes match",
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Digit codes do not match",
      });
    }
  } catch (error) {
    console.error("Error verifying bin:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while verifying the bin",
    });
  }
});

export const VerifyBinoutbound = catchAsync(async (req, res) => {
  try {
    // Extracting digit_3_codes and _id from the request body
    const { digit_3_codes, _id } = req.body;
    console.log(digit_3_codes, _id);

    // Fetching the document by _id
    const production = await OutboundForkliftModel.findById(_id);
    if (!production) {
      return res.status(404).json({
        status: false,
        message: "Bin not found",
      });
    }
    // Checking if the provided digit_3_codes matches the one in the database
    if (production.digit_3_codes === digit_3_codes) {
      const now = new Date();
      const formattedDateTime = now.toISOString();
      production.confirm_date = formattedDateTime;
      production.status = "Closed"; // Update with your actual field name for status
      await production.save();
      return res.status(200).json({
        status: true,
        message: "Digit codes match",
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Digit codes do not match",
      });
    }
  } catch (error) {
    console.error("Error verifying bin:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while verifying the bin",
    });
  }
});

export const ListTransaction = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
  } = req.query;
  // console.log(search);

  var searchQuery = { deleted_at: null };
  if (search) {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    searchQuery = {
      ...searchQuery,
      $or: [
        { production_line: searchRegex },
        { sku_code: searchRegex },
        { sut: searchRegex },
        { status: searchRegex },
        { assigned_to: searchRegex },
        { batch: searchRegex },
        { bin: searchRegex },
      ],
    };
  }

  const totalDocument = await ProductionModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const produntionLineList = await ProductionModel.aggregate([
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
        from: "productionlines", // The name of the ProductLine collection
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
    {
      $lookup: {
        from: "bins", // The name of the BinModel collection
        localField: "bin_id", // The field in ProductionModel to match
        foreignField: "_id", // The field in the BinModel collection to match
        as: "bin_details", // The name of the field to add the matched documents
      },
    },
    {
      $unwind: {
        path: "$bin_details",
        preserveNullAndEmptyArrays: true, // Preserves the document if no match is found
      },
    },
    {
      $lookup: {
        from: "materials", // The name of the BinModel collection
        localField: "material_id", // The field in ProductionModel to match
        foreignField: "_id", // The field in the BinModel collection to match
        as: "material_details", // The name of the field to add the matched documents
      },
    },
    {
      $unwind: {
        path: "$material_details",
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
      message: "All ProduntionLine List",
    });
  }
});

export const GetAllStatusCount = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const userId = authUserDetail._id;

  // Fetch user and their role details
  const user = await UserModel.findOne({ _id: userId }).populate("role_id"); // Assuming 'role' is a reference field
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  const isAdmin = user.role_id.role_name === "Admin"; // Adjust based on how you store and reference roles
  let searchQuery = { deleted_at: null };
  if (!isAdmin) {
    searchQuery = { ...searchQuery, created_employee_id: userId };
  }

  const statusCounts = await ProductionModel.aggregate([
    {
      $facet: {
        // Group by status and count
        statusCounts: [
          {
            $match: {
              deleted_at: { $eq: null },
              ...searchQuery, // Filter out documents where deleted_at is not null
            },
          },
          {
            $group: {
              _id: "$status", // Group by the 'status' field
              count: { $sum: 1 }, // Sum 1 for each document in the group
            },
          },
          {
            $project: {
              status: "$_id", // Rename '_id' to 'status'
              count: 1, // Include the count in the output
              _id: 0, // Exclude the '_id' field from the output
            },
          },
        ],
        // Count deleted documents
        deletedCount: [
          {
            $match: {
              deleted_at: { $ne: null }, // Match documents where deleted_at is not null
            },
          },
          {
            $count: "count", // Count the number of documents
          },
        ],
      },
    },
    {
      $project: {
        statusCounts: 1,
        deletedCount: {
          $arrayElemAt: ["$deletedCount.count", 0], // Extract the count value from the array
        },
      },
    },
  ]);

  // Transform the array into an object with status as keys
  const statusCountObject = statusCounts[0].statusCounts.reduce((acc, cur) => {
    acc[cur.status] = cur.count;
    return acc;
  }, {});

  res.status(200).json({
    data: {
      pending: statusCountObject["Pending"] || 0,
      verified: statusCountObject["Verified"] || 0,
      allocated: statusCountObject["Allocated"] || 0,
      deleted: statusCounts[0].deletedCount || 0,
    },
    status: true,
    message: "Status List",
  });
});

export const UpdateProduntionMaster = catchAsync(async (req, res) => {
  const produntionId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(produntionId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid produntion ID",
    });
  }
  const produntionLine = await ProductionModel.findByIdAndUpdate(
    produntionId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!produntionLine) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Produntion not found.",
    });
  }
  res.status(200).json({
    result: produntionLine,
    status: true,
    message: "Updated successfully",
  });
});

export const ListProductionWithOutPermission = catchAsync(async (req, res) => {
  try {
    // Assuming "process_order" is the field you want to get unique values for
    const uniqueProcessOrders = await ProductionModel.distinct("process_order");
    return res.status(200).json({
      result: uniqueProcessOrders,
      status: true,
      message: "Unique Process Orders List",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching unique process orders.",
      error: error.message,
    });
  }
});

export const ListProductionReport = catchAsync(async (req, res) => {
  const { processOrder, sortBy = "created_at", sort = "desc" } = req.body;
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
  const matchCriteria = {
    process_order: processOrder,
  };

  if (!isAdmin) {
    matchCriteria.created_employee_id = userId; // Restrict to user's own entries if not admin
  }

  const productionLineList = await ProductionModel.aggregate([
    {
      $match: matchCriteria,
    },
    {
      $sort: {
        [sortBy]: sort === "desc" ? -1 : 1,
        transfer_order: sort === "desc" ? -1 : 1,
      },
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
        from: "productionlines", // The name of the ProductionLine collection
        localField: "production_line", // The field in ProductionModel to match
        foreignField: "_id", // The field in the ProductionLine collection to match
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

  if (productionLineList) {
    return res.status(200).json({
      result: productionLineList,
      status: true,
      message: "All ProductionLine List",
    });
  } else {
    return res.status(404).json({
      status: false,
      message: "No Production Lines found",
    });
  }
});
