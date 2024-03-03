const asyncHandler = require('express-async-handler');
const Admin=require('../Models/AdminModel');
const sendMessage=asyncHandler(async(req,res)=>{
    const reqUser=req.user;
    const interest = req.body?.interest;
    const accusedUser = req.body?.accusedUser;
    const reason = req.body?.reason;
    const pic = req.body?.pic;
    if(!reqUser) {
        res.status(400);
        throw new Error("Please login to continue");
    }
    if(!interest){
        //accusation case 
        const data = await Admin.create({
            reqUser,accusedUser,reason,pic
        });
        if(!data){
            res.status(400);
            throw new Error("Invalid User Data");
        }
        res.json(data);
    }
    else{
        //interest case
        const data = await Admin.create({
            reqUser,interest
        });
        if(!data){
            res.status(400);
            throw new Error("Invalid User Data");
        }
        res.json(data);
    }
});
const getMessages=asyncHandler(async(req,res)=>{
    const data = await Admin.find({}).populate("reqUser").populate("accusedUser");
    res.json(data);
});
const deleteMessage=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const {data} = await Admin.findByIdAndDelete(id);
    res.json(data);
});
module.exports={sendMessage,getMessages,deleteMessage};