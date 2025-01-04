import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import VendorModel from "../../database/schema/masters/vendor.schema.js";

export const AddVendorMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const vendorData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newVendorList = new VendorModel(vendorData);
  const savedVendor = await newVendorList.save();
  return res.status(201).json({
    result: savedVendor,
    status: true,
    message: "Vendor created successfully",
  });
});

export const UpdateVendorMaster = catchAsync(async (req, res) => {
  const vendorId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res
      .status(400)
      .json({ result: [], status: false, message: "Invalid vendor ID" });
  }
  const vendor = await VendorModel.findByIdAndUpdate(
    vendorId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!vendor) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Vendor not found.",
    });
  }
  res.status(200).json({
    result: vendor,
    status: true,
    message: "Updated successfully",
  });
});

export const ListVendorMaster = catchAsync(async (req, res) => {
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
  const totalDocument = await VendorModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const vendorList = await VendorModel.aggregate([
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
  if (vendorList) {
    return res.status(200).json({
      result: vendorList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Vendor List",
    });
  }
});

export const ListVendorMasterWithOutPermission = catchAsync(
  async (req, res) => {
    const vendorList = await VendorModel.find();
    return res.status(201).json({
      result: vendorList,
      status: true,
      message: "All Vendor List",
    });
  }
);
