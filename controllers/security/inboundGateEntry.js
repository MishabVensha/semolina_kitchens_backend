import InboundGateEntryModel from "../../database/schema/security/inboundGateEntry.schema.js";
import catchAsync from "../../utils/errors/catchAsync.js";
import mongoose from "mongoose";
export const AddGateEntryInbound = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const materialData = {
    ...req.body,
    created_employee_id: authUserDetail._id,
  };
  const newInboundList = new InboundGateEntryModel(materialData);
  const savedInbound = await newInboundList.save();
  return res.status(201).json({
    result: savedInbound,
    status: true,
    message: "Inbound created successfully",
  });
});

export const UpdateGateEntryInbound = catchAsync(async (req, res) => {
  const materialId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(materialId)) {
    return res
      .status(400)
      .json({ result: [], status: false, message: "Invalid material ID" });
  }
  const material = await InboundGateEntryModel.findByIdAndUpdate(
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

export const ListGateEntryInbound = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "updated_at",
    sort = "desc",
    search,
  } = req.query;
  console.log(search);

  var searchQuery = { deleted_at: null };
  if (search) {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    searchQuery = {
      ...searchQuery,
      $or: [
        { Production_Line: searchRegex },
        { SKU_Code: searchRegex },
        { SUT: searchRegex },
        { status: searchRegex },
        { Assigned_To: searchRegex },
        { Batch: searchRegex },
        { Bin: searchRegex },
      ],
    };
  }

  const totalDocument = await InboundGateEntryModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const produntionLineList = await InboundGateEntryModel.aggregate([
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

  if (produntionLineList) {
    return res.status(200).json({
      result: produntionLineList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All ProduntionLine List",
    });
  }
});
