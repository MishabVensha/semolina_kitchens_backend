import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  vehicle_number: {
    type: String,
    required: [true, "Vehicle Number is required."],
    trim: true,
  },
  vehicle_type: {
    type: String,
    required: [true, "Vehicle Type is required."],
    trim: true,
  },
  make: {
    type: String,
    required: [true, "Make is required."],
    trim: true,
  },
  model: {
    type: String,
    required: [true, "Model is required."],
    trim: true,
  },
  year_of_manufacture: {
    type: Number,
    required: [true, "Year of Manufacture is required."],
  },
  registration_number: {
    type: String,
    required: [true, "Registration Number is required."],
    trim: true,
  },
  registration_date: {
    type: Date,
    required: [true, "Registration Date is required."],
  },
  fitness_certificate_number: {
    type: String,
    required: [true, "Fitness Certificate Number is required."],
    trim: true,
  },
  fitness_certificate_date: {
    type: Date,
    required: [true, "Fitness Certificate Date is required."],
  },

  vehicle_capacity: {
    type: String,

    trim: true,
  },
  vehicle_owner: {
    type: String,

    trim: true,
  },
  vehicle_insurance_number: {
    type: String,
    trim: true,
  },
  vehicle_insurance_date: {
    type: Date,
  },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
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

const VehicleModel = mongoose.model("vehicle", VehicleSchema);

export default VehicleModel;
