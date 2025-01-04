import mongoose from "mongoose";
import XLSX from "xlsx";
import catchAsync from "../../utils/errors/catchAsync.js";
import CustomerTypeModel from "../../database/schema/masters/customerType.schema.js";

export const AddCustomerTypeMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const customerTypeData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newCustomerTypeList = new CustomerTypeModel(customerTypeData);
  const savedCustomerType = await newCustomerTypeList.save();
  return res.status(201).json({
    result: savedCustomerType,
    status: true,
    message: "Production Line created successfully",
  });
});

export const UpdateCustomerTypeMaster = catchAsync(async (req, res) => {
  const customerTypeId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(customerTypeId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid customerType ID",
    });
  }
  const customerType = await CustomerTypeModel.findByIdAndUpdate(
    customerTypeId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!customerType) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "CustomerType not found.",
    });
  }
  res.status(200).json({
    result: customerType,
    status: true,
    message: "Updated successfully",
  });
});

export const ListCustomerTypeMaster = catchAsync(async (req, res) => {
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
  const totalDocument = await CustomerTypeModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const customerTypeList = await CustomerTypeModel.aggregate([
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
  if (customerTypeList) {
    return res.status(200).json({
      result: customerTypeList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All CustomerType List",
    });
  }
});

export const DropdownCustomerTypeMaster = catchAsync(async (req, res) => {
  const list = await CustomerTypeModel.aggregate([
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
    message: "Customer Type Dropdown List",
  });
});

export const BulkUploadCustomerTypeMaster = catchAsync(
  async (req, res, next) => {
    const file = req.file;
    const workbook = XLSX.readFile(file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(data, "data");

    const session = await CustomerTypeModel.startSession();
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
        const requiredFields = ["customerType_no", "item_physical_location"];

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
          customerType_no: item.customerType_no,
          item_physical_location: item.item_physical_location,
          customerType_remarks: item.customerType_remarks,
          created_employee_id: authUserDetail._id,
          status: "active",
        };
        console.log(itemMasterData, "itemMasterData");

        const newItemMaster = new CustomerTypeModel(itemMasterData);
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
  }
);
