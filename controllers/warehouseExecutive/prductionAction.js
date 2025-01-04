import mongoose from "mongoose";
import BinModel from "../../database/schema/masters/bin.schema.js";
import MaterialModel from "../../database/schema/masters/materials.schema.js";
import StorageSearchModel from "../../database/schema/masters/storageSearch.schema.js";
import ProductionModel from "../../database/schema/warehouseExecutive/production.js";
import catchAsync from "../../utils/errors/catchAsync.js";

export const CrossDockerAllocate = catchAsync(async (req, res) => {
  try {
    const { items } = req.body;
    console.log(items, "items");

    if (!items || items.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No items provided",
      });
    }

    // Create an array to store update promises
    const updatePromises = items.map(async (item) => {
      const { id, cross_dock_name } = item;

      // Generate a 3-character code
      const threeCharCode = "111";

      // Update the production collection
      return ProductionModel.updateOne(
        { _id: id }, // Find the document by its ID
        {
          $set: {
            bin: cross_dock_name,
            digit_3_codes: threeCharCode,
            status: "Allocated",
          },
        } // Set the new values
      );
    });

    // Execute all update promises
    await Promise.all(updatePromises);

    return res.status(200).json({
      result: items,
      status: true,
      message: "Production updated successfully",
    });
  } catch (error) {
    console.error("Error updating production:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the production",
    });
  }
});

export const AllocateBin = catchAsync(async (req, res) => {
  try {
    const transferOrderIds = req.body.item_details.map((item) => item._id);

    const transferOrders = await ProductionModel.find({
      _id: { $in: transferOrderIds },
    });

    const results = [];

    for (const item of transferOrders) {
      const fetchingMaterial = await MaterialModel.findOne({
        sku_code: item.sku_code,
      }).select("sku_group ssi");

      if (!fetchingMaterial) {
        results.push({
          status: false,
          production_id: item._id,
          transfer_order: item.transfer_order,
          sku_code: item.sku_code,
          message: `Material with SKU code ${item.sku_code} not found`,
        });
        continue;
      }

      const fetchingStorage = await StorageSearchModel.findOne({
        sku_group: fetchingMaterial.sku_group,
        ssi: fetchingMaterial.ssi,
      });

      if (!fetchingStorage) {
        results.push({
          status: false,
          production_id: item._id,
          transfer_order: item.transfer_order,
          sku_code: item.sku_code,
          message: "Storage not found",
        });
        continue;
      }

      const fetchingBin = await BinModel.findOne({
        storage_section: { $in: fetchingStorage.storage_sections },
        bin_capacity: { $gt: 0 },
      }).sort({
        created_at: 1,
      });

      if (!fetchingBin) {
        results.push({
          status: false,
          production_id: item._id,
          transfer_order: item.transfer_order,
          sku_code: item.sku_code,
          message: "Bin not found",
        });
        continue;
      }

      //   // Check if the bin has the specific capacity of 1
      if (fetchingBin.bin_capacity < 1) {
        results.push({
          status: false,
          production_id: item._id,
          transfer_order: item.transfer_order,
          sku_code: item.sku_code,
          message: `Bin ${fetchingBin.bin_no} does not have enough capacity`,
        });
        continue;
      }

      //  Update the bin's capacity (decrement by 1)
      await BinModel.updateOne(
        { _id: fetchingBin._id },
        { $inc: { bin_capacity: -1 } }
      );

      await ProductionModel.updateOne(
        { _id: item._id },
        {
          bin: fetchingBin.bin_no,
          bin_id: fetchingBin._id,
          status: "Allocated",
          digit_3_codes: fetchingBin.digit_3_code,
        }
      );

      results.push({
        status: true,
        production_id: item._id,
        sku_code: item.sku_code,
        transfer_order: item.transfer_order,
        message: "Bin allocated successfully",
      });
    }

    if (results.some((result) => result.status === false)) {
      return res.status(200).json({
        status: false,
        data: results.filter((result) => result.status === false),
        message: "Some bins could not be allocated",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Bins allocated successfully",
      result: results,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
});

export const BinOverflow = catchAsync(async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No items provided for updating bins",
      });
    }

    // Loop through each item in the array and update the corresponding document
    const updatePromises = items.map((item) =>
      ProductionModel.updateOne(
        { _id: item.productionId },
        {
          $set: {
            bin: item.binNumber,
            digit_3_codes: "123",
            status: "Allocated",
            over_flow_status: true,
          },
        }
      )
    );

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);

    return res.status(200).json({
      status: true,
      message: "Bins updated successfully",
      results,
    });
  } catch (err) {
    console.error("Error updating bins:", err);
    return res.status(500).json({
      status: false,
      message: `Something went wrong: ${err.message}`,
    });
  }
});

// set last pallet
export const SetLastPallet = catchAsync(async (req, res) => {
  const productionId = req.query.id;
  const updateData = req.body;

  // Validate the production ID
  if (!mongoose.Types.ObjectId.isValid(productionId)) {
    return res.status(400).json({
      result: [],
      status: false,
      message: "Invalid production ID",
    });
  }

  try {
    // Fetch the production line details
    const productionLine = await ProductionModel.findById(productionId);
    if (!productionLine) {
      return res.status(404).json({
        result: [],
        status: false,
        message: "Production line not found.",
      });
    }

    // Check if pallet_qty has changed
    if (
      updateData.pallet_qty &&
      updateData.pallet_qty !== productionLine.pallet_qty
    ) {
      // Fetch all related production lines
      const relatedProductionLines = await ProductionModel.find({
        process_order: productionLine.process_order,
        production_line: productionLine.production_line,
      }).sort({ process_order: 1 }); // Ensure proper ordering

      // Find the index of the current production line
      const currentIndex = relatedProductionLines.findIndex(
        (line) => line._id.toString() === productionId
      );

      if (currentIndex !== -1) {
        // Update the status of all documents following the current one
        const idsToUpdate = relatedProductionLines
          .slice(currentIndex + 1)
          .map((line) => line._id);

        await ProductionModel.updateMany(
          { _id: { $in: idsToUpdate } },
          { $set: { deleted_at: new Date() } }
        );
      }
    }

    updateData.last_pallate_status = true;
    // Update the production line with new data
    const updatedProductionLine = await ProductionModel.findByIdAndUpdate(
      productionId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      result: updatedProductionLine,
      status: true,
      message: "Updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: [],
      status: false,
      message: "Server error occurred",
    });
  }
});
