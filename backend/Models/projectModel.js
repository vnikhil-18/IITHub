const mongoose = require('mongoose')

const projectModel = mongoose.Schema (
    {
        title:{
            type:String,
            trim:true,
            required:true
        },
        professor:{
            type:String,
            trim:true,
            required:true
        },
        institute:{
            type:String,
            trim:true,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        abstract:{
            type:String,
            required:true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        file:{
            type:Buffer,
        },
        fileName:{
            type:String
        },
        img:{
            type:String,
            default:"http://res.cloudinary.com/dq7oyedtj/image/upload/v1699164162/kvj75q0lbch6bwg7xhb2.png"
        }
    },
    {
        timestamps:true,
    }
);
module.exports = mongoose.model("projectDetails",projectModel);