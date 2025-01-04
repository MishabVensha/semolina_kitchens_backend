import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import XLSX from "xlsx";
import CrossDockModel from "../../database/schema/masters/crossDock.schema.js";

export const AddCrossDockMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const crossDockData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newCrossDockList = new CrossDockModel(crossDockData);
  const savedCrossDock = await newCrossDockList.save();
  return res.status(201).json({
    result: savedCrossDock,
    status: true,
    message: "Cross Dock created successfully",
  });
});

export const UpdateCrossDockMaster = catchAsync(async (req, res) => {
  const crossDockId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(crossDockId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid crossDock ID",
    });
  }
  const crossDock = await CrossDockModel.findByIdAndUpdate(
    crossDockId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!crossDock) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "CrossDock not found.",
    });
  }
  res.status(200).json({
    result: crossDock,
    status: true,
    message: "Updated successfully",
  });
});

export const ListCrossDockMaster = catchAsync(async (req, res) => {
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
        {
          cross_dock_name: searchRegex,
        },
      ],
    };
  }
  const totalDocument = await CrossDockModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const crossDockList = await CrossDockModel.aggregate([
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
  if (crossDockList) {
    return res.status(200).json({
      result: crossDockList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All CrossDock List",
    });
  }
});

export const DropdownCrossDockMaster = catchAsync(async (req, res) => {
  const list = await CrossDockModel.aggregate([
    {
      $match: {
        status: "active",
      },
    },
    {
      $project: {
        cross_dock_name: 1,
      },
    },
  ]);
  res.status(200).json({
    result: list,
    status: true,
    message: "CrossDock Dropdown List",
  });
});

export const BulkUploadCrossDockMaster = catchAsync(async (req, res, next) => {
  const file = req.file;
  const workbook = XLSX.readFile(file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  console.log(data, "data");

  const session = await CrossDockModel.startSession();
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
      const requiredFields = ["crossDock_no", "item_physical_location"];

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
        crossDock_no: item.crossDock_no,
        item_physical_location: item.item_physical_location,
        crossDock_remarks: item.crossDock_remarks,
        created_employee_id: authUserDetail._id,
        status: "active",
      };
      console.log(itemMasterData, "itemMasterData");

      const newItemMaster = new CrossDockModel(itemMasterData);
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
});
