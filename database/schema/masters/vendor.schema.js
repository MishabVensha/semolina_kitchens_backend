import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  vendor_code: {
    type: String,
    required: [true, "Vendor Code is required."],
    trim: true,
  },
  vendor_name: {
    type: String,
    required: [true, "Vendor Name is required."],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required."],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required."],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "State is required."],
    trim: true,
  },
  pin_code: {
    type: String,
    required: [true, "Pin Code is required."],
    trim: true,
  },
  contact_person: {
    type: String,
    required: [true, "Contact Person is required."],
    trim: true,
  },
  phone_number: {
    type: String,
    required: [true, "Phone Number is required."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
  },
  vendor_type: {
    type: String,

    trim: true,
  },
  gst_number: {
    type: String,

    trim: true,
  },
  pan_number: {
    type: String,

    trim: true,
  },
  bank_details: {
    type: String,
    trim: true,
  },
  latitude: {
    type: String,
    trim: true,
  },
  longitude: {
    type: String,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
    trim: true,
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

const VendorModel = mongoose.model("vendor", VendorSchema);

export default VendorModel;
