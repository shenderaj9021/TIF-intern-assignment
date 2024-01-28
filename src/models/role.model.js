const mongoose = require("mongoose")


// schema for Role
const roleSchema = new mongoose.Schema({
    _id:{type:String},
    name :{type:String,maxlength:64},
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
},{ versionKey: false })

// Middleware to update update_at field
roleSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

const Role = mongoose.model("Role",roleSchema);

module.exports = Role;
  