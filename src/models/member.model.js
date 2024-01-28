const mongoose = require("mongoose")

// Schema for member
const memberSchema = new mongoose.Schema({
    _id:{type:String},
    community: {
        type: mongoose.Schema.Types.String,
        ref: 'Community', // Reference to the User model
    },
    user :{
        type:mongoose.Schema.Types.String,
        ref:'User'
    },
    role:{
        type:mongoose.Schema.Types.String,
        ref:'Role'
    },
    created_at:{
        type:Date,
        default:Date.now
    }
},{ versionKey: false })


const Member = mongoose.model("Member",memberSchema);

module.exports = Member;