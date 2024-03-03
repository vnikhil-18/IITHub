const mongoose =require('mongoose')
const AcademicAdmin =mongoose.Schema({
    reqUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    Branch:{
        type:String,
    },
    Subject:{
        type:String,
    },
},
{
    timestamps:true
});
const User=mongoose.model("AcademicAdmin",AcademicAdmin);
module.exports = User;