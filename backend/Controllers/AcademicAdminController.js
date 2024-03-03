const asyncHandler = require('express-async-handler');
const AcademicAdmin=require('../Models/AcademicAdminModel');
const sendMessage=asyncHandler(async(req,res)=>{
    const reqUser=req.body.user;
    const newBranch=req.body?.Branch;
    const newSubject=req.body?.Subject;
    console.log(req.body)
    if(!reqUser || (!newBranch && !newSubject)) {
        res.status(400);
        throw new Error("Please login to continue");
    }
    if(!newSubject){
        const data = await AcademicAdmin.create({
            reqUser:reqUser,
            Branch:newBranch
        });
        if(!data){
            res.status(400);
            throw new Error("Invalid User Data");
        }
        res.json(data);
    }
    else{
        const data = await AcademicAdmin.create({
            reqUser:reqUser,
            Subject:newSubject,
            Branch:newBranch
        });
        if(!data){
            res.status(400);
            throw new Error("Invalid User Data");
        }
        res.json(data);
    }
});
const getMessages=asyncHandler(async(req,res)=>{
    const data = await AcademicAdmin.find({}).populate('reqUser');
    res.json(data);
});
const deleteMessage=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const {data} = await AcademicAdmin.findByIdAndDelete(id);
    res.json(data);
});
module.exports={sendMessage,getMessages,deleteMessage};