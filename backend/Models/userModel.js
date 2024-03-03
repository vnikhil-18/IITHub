const mongoose =require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const userSchema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    collegeName:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://icon-library.com/images/anonymous-icon/anonymous-icon-0.jpg"
    },
    discipline:{
        type:String,
        default:""
    },
    branch:{
        type:String,
        required:true,
        default:""
    },
    graduationyear:{
        type:String,
        default:""
    },
    workingas:{
        type:String,
        default:""
    },
    company:{
        type:String,
        default:""
    },
    highestDegreeOfQualification:{
        type:String,
        default:""
    },
    openMsg:{
        type:Boolean,
        default:true
    },
    banned:{
        type:Boolean,
        default:false
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]

},
{
    timestamps:true
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return enteredPassword=== this.password;
  };
const User=mongoose.model("User",userSchema);
module.exports = User;