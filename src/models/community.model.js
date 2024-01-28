const mongoose = require('mongoose')
const {snowflake} = require("@theinternetfolks/snowflake")

// schema for Community

const communitySchema = new mongoose.Schema({
    _id:{type:String},
    name: {type: String,required:true,maxlength:128},
    slug : {type:String, maxlength:128, unique:true},
    owner: {
        type: mongoose.Schema.Types.String,
        ref: 'User', // Reference to the User model
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    created_at:{
        type:Date,
        default:Date.now
      }
},{ versionKey: false })
// Middleware to update updated_at field automatically 
communitySchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
  });

const Community = mongoose.model("Community",communitySchema);

module.exports = Community;