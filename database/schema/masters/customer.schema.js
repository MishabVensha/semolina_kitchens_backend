import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  customer_code: {
    type: String,
    required: [true, "Customer Code is required."],
    trim: true,
  },
  customer_name: {
    type: String,
    required: [true, "Customer Name is required."],
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
  credit_limit: {
    type: Number,

    default: 0,
  },
  created_employee_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
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
  //Bill To Information

  bill_to_code: {
    type: String,
    required: [true, "Customer Code is required."],
    trim: true,
  },

  bill_to_address: {
    type: String,
    required: [true, "Address is required."],
    trim: true,
  },
  bill_to_city: {
    type: String,
    required: [true, "City is required."],
    trim: true,
  },
  bill_to_district: {
    type: String,
    required: [true, "district is required."],
    trim: true,
  },
  bill_to_state: {
    type: String,
    required: [true, "State is required."],
    trim: true,
  },
  bill_pin_code: {
    type: String,
    // required: [true, "Pin Code is required."],
    trim: true,
  },
  bill_to_contact_person: {
    type: String,
    required: [true, "Contact Person is required."],
    trim: true,
  },
  bill_to_email: {
    type: String,
    required: [true, "Contact Person is required."],
    trim: true,
  },
  bill_to_zone: {
    type: String,
    required: [true, "zone is required."],
    trim: true,
  },

  //ship To Information

  ship_to: [
    {
      ship_to_code: {
        type: String,
        required: [true, "Customer Code is required."],
        trim: true,
      },

      ship_to_address: {
        type: String,
        required: [true, "Address is required."],
        trim: true,
      },
      ship_to_city: {
        type: String,
        required: [true, "City is required."],
        trim: true,
      },
      ship_to_district: {
        type: String,
        required: [true, "district is required."],
        trim: true,
      },
      ship_to_state: {
        type: String,
        required: [true, "State is required."],
        trim: true,
      },
      // ship_pin_code: {
      //   type: String,
      //   required: [true, "Pin Code is required."],
      //   trim: true,
      // },
      ship_to_contact_person: {
        type: String,
        required: [true, "Contact Person is required."],
        trim: true,
      },
      ship_to_email: {
        type: String,
        required: [true, "Contact Person is required."],
        trim: true,
      },
      ship_to_zone: {
        type: String,
        required: [true, "zone is required."],
        trim: true,
      },
    },
  ],
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

const CustomerModel = mongoose.model("customer", CustomerSchema);

export default CustomerModel;
