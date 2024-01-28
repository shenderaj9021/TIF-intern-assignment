const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id:{type:String},
  name: { type: String, required: true, default :null,  maxlength: 64, },
  email: { type: String, required: true, unique: true, maxlength: 128 },
  password: { type: String, required: true, maxlength: 64 },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at:{
    type:Date,
    default:Date.now
  }
},{ versionKey: false });

// Middleware to update updated_at field automatically 
userSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
