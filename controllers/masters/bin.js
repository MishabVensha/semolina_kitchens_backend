import mongoose from "mongoose";
import BinModel from "../../database/schema/masters/bin.schema.js";
import storageTypeModel from "../../database/schema/masters/storageType.schema.js";
import catchAsync from "../../utils/errors/catchAsync.js";

export const AddBinMaster = catchAsync(async (req, res) => {
  const authUserDetail = req.userDetails;
  const { bin_capacity, bin_no } = req.body;

  // Create an array to hold the bin combinations
  const binCombinations = [];

  // Loop through the bin capacity to generate combinations
  for (let i = 1; i <= bin_capacity; i++) {
    // Generate the bin combination
    const binCombination = `${bin_no}-${i}`;

    // Create the bin data object
    const binData = {
      ...req.body,
      bin_capacity: 1,
      bin_combination_no: i,
      bin_combination: binCombination,
      created_employee_id: authUserDetail._id,
    };

    // Add the bin data to the array
    binCombinations.push(binData);
  }

  // Save all bin combinations to the database at once
  const savedBins = await BinModel.insertMany(binCombinations);

  return res.status(201).json({
    result: savedBins,
    status: true,
    message: "Bins created successfully",
  });
});

export const UpdateBinMaster = catchAsync(async (req, res) => {
  const binId = req.query.id;
  const updateData = req.body;
  if (!mongoose.Types.ObjectId.isValid(binId)) {
    return res
      .status(400)
      .json({ result: [], status: false, message: "Invalid bin ID" });
  }
  const bin = await BinModel.findByIdAndUpdate(
    binId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!bin) {
    return res.status(404).json({
      result: [],
      status: false,
      message: "Bin not found.",
    });
  }
  res.status(200).json({
    result: bin,
    status: true,
    message: "Updated successfully",
  });
});

export const ListBinMaster = catchAsync(async (req, res) => {
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
        {
          storage_type: searchRegex,
        },
        { storage_section: searchRegex },
        { bin_no: searchRegex },
        { bin_combination: searchRegex },
        { type: searchRegex },
        { description: searchRegex },
        { digit_3_code: searchRegex },
      ],
    };
  }
  const totalDocument = await BinModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalDocument / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);
  const binList = await BinModel.aggregate([
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
        from: "bintypes",
        localField: "type",
        foreignField: "_id",
       
        as: "type",
      },
    },
    {
      $unwind: {
        path: "$type",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $match: { ...searchQuery },
    },
    {
      $sort: {
        [sortBy]: sort === "desc" ? -1 : 1,
        ["bin_combination_no"]: sort === "desc" ? -1 : 1,
      },
    },

    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  
  if (binList) {
    return res.status(200).json({
      result: binList,
      status: true,
      totalPages: totalPages,
      currentPage: validPage,
      message: "All Bin List",
    });
  }
});

export const ListBinMasterWithOutPermission = catchAsync(async (req, res) => {
  const binList = await storageTypeModel.find();
  return res.status(201).json({
    result: binList,
    status: true,
    message: "All Bin List",
  });
});
