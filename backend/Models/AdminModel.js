const mongoose =require('mongoose')
const AdminSchema =mongoose.Schema({
    reqUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    interest:{
        type:String,
    },
    accusedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reason:{
        type:String,
    },
    pic:{
        type:String,
    },
},
{
    timestamps:true
});
const User=mongoose.model("Admin",AdminSchema);
module.exports = User;