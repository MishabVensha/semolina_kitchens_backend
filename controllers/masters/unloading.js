import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import UnLoadingModel from "../../database/schema/masters/unloading.schema.js";

export const AddUnLoadingMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const vehicleData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newVehicleList = new UnLoadingModel(vehicleData);
  const savedVehicle = await newVehicleList.save();
  return res.status(201).json({
    result: savedVehicle,
    status: true,
    message: "unLoading created successfully",
  });
});

export const UpdateUnLoadingMaster = catchAsync(async (req, res) => {
  const produntionLineId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(produntionLineId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid produntionLine ID",
    });
  }
  const produntionLine = await UnLoadingModel.findByIdAndUpdate(
    produntionLineId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!produntionLine) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Unloading not found.",
    });
  }
  res.status(200).json({
    result: produntionLine,
    status: true,
    message: "Updated successfully",
  });
});

export const ListUnLoadingMaster = catchAsync(async (req, res) => {
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
  const totalDocument = await UnLoadingModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const UnloadingList = await UnLoadingModel.aggregate([
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
  if (UnloadingList) {
    return res.status(200).json({
      result: UnloadingList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Unloading List",
    });
  }
});
