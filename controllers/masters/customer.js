import mongoose from "mongoose";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import CustomerModel from "../../database/schema/masters/customer.schema.js";

export const AddCustomerMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const customerData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newCustomerList = new CustomerModel(customerData);
  const savedCustomer = await newCustomerList.save();
  return res.status(201).json({
    result: savedCustomer,
    status: true,
    message: "Customer created successfully",
  });
});

export const UpdateCustomerMaster = catchAsync(async (req, res) => {
  const customerId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res
      .status(400)
      .json({ result: [], status: false, message: "Invalid customer ID" });
  }
  const customer = await CustomerModel.findByIdAndUpdate(
    customerId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!customer) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Customer not found.",
    });
  }
  res.status(200).json({
    result: customer,
    status: true,
    message: "Updated successfully",
  });
});

export const ListCustomerMaster = catchAsync(async (req, res) => {
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
  const totalDocument = await CustomerModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const customerList = await CustomerModel.aggregate([
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
  if (customerList) {
    return res.status(200).json({
      result: customerList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Customer List",
    });
  }
});

export const ListCustomerMasterWithOutPermission = catchAsync(
  async (req, res) => {
    const customerList = await CustomerModel.find();
    return res.status(201).json({
      result: customerList,
      status: true,
      message: "All Customer List",
    });
  }
);
export const ListCustomerMasterById = catchAsync(async (req, res) => {
  const Name = req.query.customer_name;
  const customerList = await CustomerModel.findOne({ customer_name: Name });
  return res.status(201).json({
    result: customerList,
    status: true,
    message: "Get Customer List",
  });
});
