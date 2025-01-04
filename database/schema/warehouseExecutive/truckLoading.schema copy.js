import mongoose from "mongoose";

const truckLoadingSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "Date is required."],
  },
  trip_number: {
    type: String,
    trim: true,
  },
  truck_number: {
    type: String,
    required: [true, "Truck Number is required."],
    trim: true,
  },
  truck_type: {
    type: String,
    trim: true,
  },
  transporter_name: {
    type: String,
    required: [true, "Transporter Name is required."],
    trim: true,
  },
  trip_sheet_number: {
    type: String,
    trim: true,
  },
  actual_weight: {
    type: Number,
    default: 0,
  },
  gross_weight: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

const TruckLoadingModel = mongoose.model("truckLoading", truckLoadingSchema);

export default TruckLoadingModel;
