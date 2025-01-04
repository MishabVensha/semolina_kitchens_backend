import mongoose from "mongoose";
import TruckLoadingModel from "../../database/schema/warehouseExecutive/truckLoading.schema.js";
import catchAsync from "../../utils/errors/catchAsync.js";

export const AddTruckLoading = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const truckLoadingData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newTruckLoadingList = new TruckLoadingModel(truckLoadingData);
  const savedTruckLoading = await newTruckLoadingList.save();
  return res.status(201).json({
    result: savedTruckLoading,
    status: true,
    message: "Truck Loading created successfully",
  });
});

export const UpdateTruckLoading = catchAsync(async (req, res) => {
  const truckLoadingId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(truckLoadingId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid truck Loading ID",
    });
  }
  const truckLoading = await TruckLoadingModel.findByIdAndUpdate(
    truckLoadingId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!truckLoading) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "truck Loading not found.",
    });
  }
  res.status(200).json({
    result: truckLoading,
    status: true,
    message: "Updated successfully",
  });
});

export const ListTruckLoading = catchAsync(async (req, res) => {
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
  const totalDocument = await TruckLoadingModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const truckLoadingList = await TruckLoadingModel.aggregate([
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
  if (truckLoadingList) {
    return res.status(200).json({
      result: truckLoadingList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Truck Loading List",
    });
  }
});
