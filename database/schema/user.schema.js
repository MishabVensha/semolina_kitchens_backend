import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import getConfigs from "../../config/config.js";

const Configs = getConfigs();
const UserSchema = new mongoose.Schema({
  employee_id: {
    type: Number,
    required: [true, "Employee ID is required."],
    indexedDB: true,
    unique: [true, "Employee ID already exist."],
  },
  first_name: {
    type: String,
    minlength: 1,
    maxlength: 25,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    minlength: 1,
    maxlength: 25,
    required: true,
    trim: true,
  },
  age: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  email_id: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: [true, "Email ID Required"],
    trim: true,
    unique: [true, "Email ID already exist."],
  },
  pincode: {
    type: Number,
    trim: true,
  },
  mobile_no: {
    type: String,
    unique: [true, "Mobile Number already exist."],
    required: [true, "Mobile Number Required"],
    trim: true,
    default: null,
  },
  country_code: {
    type: String,
    trim: true,
    default: null,
  },
  address: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  blood_group: {
    type: String,
    // required: true,
    trim: true,
  },
  dob: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  status: { type: Boolean, default: true },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Role is Required"],
    ref: "roles",
  },
  password: { type: String, default: null, trim: true },
  otp: { type: String, trim: true, default: null },
  verify_otp: { type: Boolean, default: false },
  otp_expiry_date: { type: String, trim: true, default: null },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    // required: true,
    trim: true,
  },
  level: {
    type: String,
    default: null,
  },
  user_remarks: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

UserSchema.methods.jwtToken = function (next) {
  try {
    return jwt.sign(
      { id: this._id, employeeId: this.employee_id, emailId: this.email_id },
      Configs.jwt.accessSecret,
      { expiresIn: Configs.jwt.accessOptions.expiresIn || "24hr" }
    );
  } catch (error) {
    return next(error);
  }
};

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
