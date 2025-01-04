import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import XLSX from "xlsx";
import storageTypeModel from "../../database/schema/masters/storageType.schema.js";

export const AddStorageTypeMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const produntionLineData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newStorageTypeList = new storageTypeModel(produntionLineData);
  const savedStorageType = await newStorageTypeList.save();
  return res.status(201).json({
    result: savedStorageType,
    status: true,
    message: "Production Line created successfully",
  });
});

export const UpdateStorageTypeMaster = catchAsync(async (req, res) => {
  const produntionLineId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(produntionLineId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid produntionLine ID",
    });
  }
  const produntionLine = await storageTypeModel.findByIdAndUpdate(
    produntionLineId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!produntionLine) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "StorageType not found.",
    });
  }
  res.status(200).json({
    result: produntionLine,
    status: true,
    message: "Updated successfully",
  });
});

export const ListStorageTypeMaster = catchAsync(async (req, res) => {
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
        { storage_type: searchRegex },
        { storage_type_description: searchRegex },
      ],
    };
  }
  const totalDocument = await storageTypeModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const produntionLineList = await storageTypeModel.aggregate([
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
  if (produntionLineList) {
    return res.status(200).json({
      result: produntionLineList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All StorageType List",
    });
  }
});

export const DropdownStorageTypeMaster = catchAsync(async (req, res) => {
  const list = await storageTypeModel.aggregate([
    {
      $match: {
        status: "active",
      },
    },
    {
      $project: {
        production_line_name: 1,
      },
    },
  ]);
  res.status(200).json({
    result: list,
    status: true,
    message: "StorageType Dropdown List",
  });
});

export const BulkUploadStorageTypeMaster = catchAsync(
  async (req, res, next) => {
    const file = req.file;
    const workbook = XLSX.readFile(file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(data, "data");

    const session = await storageTypeModel.startSession();
    session.startTransaction();

    try {
      if (data.length === 0) {
        return res.status(400).json({
          result: [],
          status: false,
          message: "No items found in the uploaded file.",
        });
      }

      const authUserDetail = req.userDetails;

      for (const item of data) {
        const requiredFields = ["produntionLine_no", "item_physical_location"];

        for (const field of requiredFields) {
          if (!item[field]) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
              result: [],
              status: false,
              message: `${field} is required for all items.`,
            });
          }
        }

        const itemMasterData = {
          produntionLine_no: item.produntionLine_no,
          item_physical_location: item.item_physical_location,
          produntionLine_remarks: item.produntionLine_remarks,
          created_employee_id: authUserDetail._id,
          status: "active",
        };
        console.log(itemMasterData, "itemMasterData");

        const newItemMaster = new storageTypeModel(itemMasterData);
        const savedItemMaster = await newItemMaster.save({ session });
        console.log(savedItemMaster, "savedItemMaster");
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        result: [],
        status: true,
        message: "Item Master bulk uploaded successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return next(error);
    }
  }
);
