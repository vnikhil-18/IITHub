const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');
const registerUser = asyncHandler(async (req,res)=>{
    const {name,email,collegeName,userType,password,pic,displine,branch,graduationyear,workingas,company,highestDegreeOfQualification} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("Please fill all the details");
    }
    const user = await User.create({
        name,email,collegeName,userType,password,pic,displine,branch,graduationyear,workingas,company,highestDegreeOfQualification
    });
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            collegeName:user.collegeName,
            userType:user.userType,
            password:user.password,
            pic:user.pic,
            openMsg:user.openMsg,
            discipline:user.discipline,
            branch:user.branch,
            graduationyear:user.graduationyear,
            workingas:user.workingas,
            company:user.company,
            highestDegreeOfQualification:user.highestDegreeOfQualification,
            following:user.following,
            token:generateToken(user._id)
        });
    }else{
        res.status(400);
        throw new Error("Invalid User Data");
    }
});
const authUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        collegeName:user.collegeName,
        userType:user.userType,
        password:user.password,
        pic:user.pic,
        graduationyear:user.graduationyear,
        discipline:user.discipline,
        branch:user.branch,
        workingas:user.workingas,
        company:user.company,
        banned:user.banned,
        openMsg:user.openMsg,
        following:user.following,
        highestDegreeOfQualification:user.highestDegreeOfQualification,
        token:generateToken(user._id)
        });
    }else{
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
})

const users = asyncHandler(async (req,res)=>{
    const user = req.query.search ? {
        $or:[
            {name : {$regex:req.query.search,$options:'i'}},
            {email : {$regex:req.query.search,$options:'i'}},
        ],
    }
    :{};
    const userlist = await User.find(user).find({_id:{$ne:req.user._id}});
    let openMsgUsers=userlist.filter((user)=>user.openMsg==true);
    console.log(openMsgUsers);
    res.send(openMsgUsers);
})
const allUsers = asyncHandler(async (req,res)=>{
    const user = req.query.search ? {
        $or:[
            {name : {$regex:req.query.search,$options:'i'}},
            {email : {$regex:req.query.search,$options:'i'}},
        ],
    }
    :{};
    const userlist = await User.find(user);
    console.log(userlist);
    res.send(userlist);
})
const updateProfile = asyncHandler(async (req,res)=>{ 
    const {userId,name,graduationyear,branch,discipline,
        highestDegreeOfQualification,company,workingas,pic}=req.body;
    console.log(req.body);
    const temp={name:name,
        graduationyear:graduationyear,
        branch:branch,
        discipline:discipline,
        highestDegreeOfQualification:highestDegreeOfQualification,
        company:company,
        workingas:workingas,
        pic:pic}
        let update=await User.findByIdAndUpdate(
            userId,
            temp,
            {new:true}
    );
    if(!update){
        res.status(400);
        throw new Error('Invalid user id');
    }
    else{
        let temp=update.toObject();
        temp.token=generateToken(update._info);
        res.status(200).json(temp);
    }
})
const updateOpenMsg= asyncHandler(async(req,res)=>{
    const userId=req.body._id;
    const openMsg=req.body.openMsg;
    console.log(openMsg)
    const user=await User.findById(userId);
    const update=await User.findByIdAndUpdate(
        userId,
        {openMsg:!user.openMsg},
        {new:true}
    );
    if(!update){
        res.status(400);
        throw new Error('Invalid user id');
    }
    else{
        let temp=update.toObject();
        temp.token=generateToken(update._info);
        res.status(200).json(temp);
    }
})
const renameGroups = asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;
    const Update=await Chat.findByIdAndUpdate(
        chatId,
        {chatName:chatName},
        {new:true}
    ).populate("users","-password")
    .populate("latestMessage");
    if(!Update){
        res.status(400);
        throw new Error('Invalid chat id');
    }
    res.status(200).json(Update);
});
const banUser = asyncHandler(async (req,res)=>{
    const userId=req.params.id;
    try {
        const usr=await(User.findById(userId));
        const result=await User.findByIdAndUpdate(
            userId,
            {banned:!usr.banned},
            {new:true}
        );
        if(result===null){
            res.status(404).send("User not found");
        }
        else{
            res.status(200).send("User banned");
        }
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
const getCnt = asyncHandler(async (req, res) => {
        const result = await User.aggregate([{
            $group: {
              _id: '$userType',
              count: { $sum: 1 }
            }
          }
        ]);
        res.json(result);
      }
)
const getBanned = asyncHandler(async (req, res) => {
    const result = await User.countDocuments({banned:true});
    res.json(result);
});
module.exports = {registerUser,authUser,users,updateProfile,updateOpenMsg,banUser,getCnt,getBanned,allUsers};