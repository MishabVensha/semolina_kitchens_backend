import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import LoadingModel from "../../database/schema/masters/loading.schema.js";

export const AddLoading = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const vehicleData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newVehicleList = new LoadingModel(vehicleData);
  const savedVehicle = await newVehicleList.save();
  return res.status(201).json({
    result: savedVehicle,
    status: true,
    message: "loading created successfully",
  });
});

export const UpdateLoadingMaster = catchAsync(async (req, res) => {
  const produntionLineId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(produntionLineId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid produntionLine ID",
    });
  }
  const produntionLine = await LoadingModel.findByIdAndUpdate(
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

export const ListLoadingMaster = catchAsync(async (req, res) => {
  const {
    string,
    boolean,
    numbers,
    arrayField = [],
  } = req?.body?.searchFields || {};
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
  } = req.query;
  const search = req.query.search || "";
  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = DynamicSearch(
      search,
      boolean,
      numbers,
      string,
      arrayField
    );
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        data: {
          user: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }
  const totalDocument = await LoadingModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const produntionLineList = await LoadingModel.aggregate([
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
