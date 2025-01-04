import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import UomModel from "../../database/schema/masters/uom.schema.js";

export const AddUomMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const uomData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newUomList = new UomModel(uomData);
  const savedUom = await newUomList.save();
  return res.status(201).json({
    result: savedUom,
    status: true,
    message: "Uom Line created successfully",
  });
});

export const UpdateUomMaster = catchAsync(async (req, res) => {
  const uomId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(uomId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid uom ID",
    });
  }
  const uom = await UomModel.findByIdAndUpdate(
    uomId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!uom) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Uom not found.",
    });
  }
  res.status(200).json({
    result: uom,
    status: true,
    message: "Updated successfully",
  });
});

export const ListUomMaster = catchAsync(async (req, res) => {
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
  const totalDocument = await UomModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const uomList = await UomModel.aggregate([
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
  if (uomList) {
    return res.status(200).json({
      result: uomList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Uom List",
    });
  }
});

export const ListUomMasterWithOutPermission = catchAsync(async (req, res) => {
  const list = await UomModel.aggregate([
    {
      $match: {
        status: "active",
      },
    },
    {
      $project: {
        uom: 1,
      },
    },
  ]);
  res.status(200).json({
    result: list,
    status: true,
    message: "Uom Dropdown List",
  });
});
