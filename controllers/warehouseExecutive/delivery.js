import mongoose from "mongoose";
import DeliveryModel from "../../database/schema/warehouseExecutive/delivery.schema.js";
import catchAsync from "../../utils/errors/catchAsync.js";

export const AddDelivery = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const deliveryData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newDeliveryList = new DeliveryModel(deliveryData);
  const savedDelivery = await newDeliveryList.save();
  return res.status(201).json({
    result: savedDelivery,
    status: true,
    message: "Truck Loading created successfully",
  });
});

export const UpdateDelivery = catchAsync(async (req, res) => {
  const deliveryId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid truck Loading ID",
    });
  }
  const delivery = await DeliveryModel.findByIdAndUpdate(
    deliveryId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!delivery) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "truck Loading not found.",
    });
  }
  res.status(200).json({
    result: delivery,
    status: true,
    message: "Updated successfully",
  });
});

export const ListDelivery = catchAsync(async (req, res) => {
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
  const totalDocument = await DeliveryModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const deliveryList = await DeliveryModel.aggregate([
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
  if (deliveryList) {
    return res.status(200).json({
      result: deliveryList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Truck Loading List",
    });
  }
});
