import mongoose from "mongoose";

const storageSearchSchema = new mongoose.Schema({
  sku_group: {
    type: String,
    required: [true, "Sku Group is required"],
    trim: true,
  },
  ssi: {
    type: String,
    required: [true, "SSI is required"],
    trim: true,
  },
  storage_sections: [
    {
      type: String,
      required: [true, "Storage Section is required"],
      trim: true,
    },
  ],
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});
const StorageSearchModel = mongoose.model("storageSearch", storageSearchSchema);

export default StorageSearchModel;
