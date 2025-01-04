import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import BinTypeModel from "../../database/schema/masters/binType.schema.js";

export const AddBinTypeMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const binTypeData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newBinTypeList = new BinTypeModel(binTypeData);
  const savedBinType = await newBinTypeList.save();
  return res.status(201).json({
    result: savedBinType,
    status: true,
    message: "Bin Type Line created successfully",
  });
});

export const UpdateBinTypeMaster = catchAsync(async (req, res) => {
  const binTypeId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(binTypeId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid binType ID",
    });
  }
  const binType = await BinTypeModel.findByIdAndUpdate(
    binTypeId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!binType) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Bin Type not found.",
    });
  }
  res.status(200).json({
    result: binType,
    status: true,
    message: "Updated successfully",
  });
});

export const ListBinTypeMaster = catchAsync(async (req, res) => {
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
  const totalDocument = await BinTypeModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const binTypeList = await BinTypeModel.aggregate([
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
      $lookup: {
        from: "uoms",
        localField: "allowed_uom",
        foreignField: "_id",
        as: "allowed_uom",
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
  if (binTypeList) {
    return res.status(200).json({
      result: binTypeList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All BinType List",
    });
  }
});

export const ListBinTypeMasterWithOutPermission = catchAsync(
  async (req, res) => {
    const list = await BinTypeModel.aggregate([
      {
        $match: {
          status: "active",
        },
      },
      {
        $project: {
          type: 1,
        },
      },
    ]);
    res.status(200).json({
      result: list,
      status: true,
      message: "Bin Type Dropdown List",
    });
  }
);
