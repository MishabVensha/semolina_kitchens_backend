import mongoose from "mongoose";
import XLSX from "xlsx";
import catchAsync from "../../utils/errors/catchAsync.js";
import { DynamicSearch } from "../../utils/dynamicSearch/dynamic.js";
import MaterialModel from "../../database/schema/masters/materials.schema.js";

export const AddMaterialMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const materialData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newMaterialList = new MaterialModel(materialData);
  const savedMaterial = await newMaterialList.save();
  return res.status(201).json({
    result: savedMaterial,
    status: true,
    message: "Material created successfully",
  });
});

export const BulkUploadMaterial = catchAsync(async (req, res, next) => {
  const file = req.file;

  if (!file || !file.path) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "No file uploaded or file path not found.",
    });
  }

  const session = await MaterialModel.startSession();
  session.startTransaction();

  try {
    const workbook = XLSX.readFile(file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      dateNF: "dd-mm-yyyy",
      raw: false,
    });
    console.log(data, "data");

    if (data.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        result: [],
        status: false,
        message: "No items found in the uploaded file.",
      });
    }

    const authUserDetail = req.userDetails;
    const materialData = data.map((item) => ({
      ...item,
      created_employee_id: authUserDetail._id,
    }));

    await MaterialModel.insertMany(materialData, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      result: [],
      status: true,
      message: "Material bulk uploaded successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const UpdateMaterialMaster = catchAsync(async (req, res) => {
  const materialId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(materialId)) {
    return res
      .status(400)
      .json({ result: [], status: false, message: "Invalid material ID" });
  }
  const material = await MaterialModel.findByIdAndUpdate(
    materialId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!material) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Material not found.",
    });
  }
  res.status(200).json({
    result: material,
    status: true,
    message: "Updated successfully",
  });
});

export const ListMaterialMaster = catchAsync(async (req, res) => {
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
      $or: [{ sku_code: searchRegex }],
    };
  }
  const totalDocument = await MaterialModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const materialList = await MaterialModel.aggregate([
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
  if (materialList) {
    return res.status(200).json({
      result: materialList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Material List",
    });
  }
});

export const ListMaterialMasterWithOutPermission = catchAsync(
  async (req, res) => {
    const materialList = await MaterialModel.find({ status: "active" });
    return res.status(201).json({
      result: materialList,
      status: true,
      message: "All Material List",
    });
  }
);
