import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import AuomModel from "../../database/schema/masters/auom.schema.js";

export const AddAuomMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const auomData = {
    ...req.body,
    uom_details: req.body.uom_details,
    created_employee_id: authUserDetail._id,
  };
  const newAuomList = new AuomModel(auomData);
  const savedAuom = await newAuomList.save();
  return res.status(201).json({
    result: savedAuom,
    status: true,
    message: "Aauom Line created successfully",
  });
});

export const UpdateAuomMaster = catchAsync(async (req, res) => {
  const auomId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(auomId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid auom ID",
    });
  }
  const auom = await AuomModel.findByIdAndUpdate(
    auomId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!auom) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Aauom not found.",
    });
  }
  res.status(200).json({
    result: auom,
    status: true,
    message: "Updated successfully",
  });
});

export const ListAuomMaster = catchAsync(async (req, res) => {
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
  const totalDocument = await AuomModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const auomList = await AuomModel.aggregate([
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
  if (auomList) {
    return res.status(200).json({
      result: auomList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Aauom List",
    });
  }
});

export const ListAuomMasterWithOutPermission = catchAsync(async (req, res) => {
  const list = await AuomModel.aggregate([
    {
      $match: {
        status: "active",
      },
    },
    {
      $project: {
        auom: 1,
      },
    },
  ]);
  res.status(200).json({
    result: list,
    status: true,
    message: "Aauom Dropdown List",
  });
});
