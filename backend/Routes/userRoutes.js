const express = require('express');
const router = express.Router();
const {registerUser,authUser,users,updateProfile,updateOpenMsg,banUser,getCnt,getBanned,allUsers} = require('../Controllers/userController');
const {protect} = require('../middleware/authMiddleware');
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');
router.route('/').post(registerUser).get(protect,users);
router.route('/login').post(authUser);
router.route('/all').get(protect,allUsers);
router.route('/search/:name').get(protect,users);
router.route('/update').put(protect,updateProfile);
router.route('/openMsg').put(protect,updateOpenMsg);
router.route('/delete/:id').put(protect,banUser);
router.route('/usertypes/count').get(getCnt);
router.route('/banned').get(getBanned);
router.put('/follow', protect, async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.body._id, {
            $push: { following: req.body.followId }
        }, { new: true }).select("-password");
        let temp=result.toObject();
        temp.token=generateToken(result._id);
        res.status(200).json(temp);
    } catch (err) {
        return res.status(400).json({ error: err });
    }
});

router.put('/unfollow', protect, async (req, res) => {
    try {
        console.log(req.body);
        const result = await User.findByIdAndUpdate(req.body._id, {
            $pull: { following: req.body.followId }
        }, { new: true }).select("-password");
        console.log(result.following);
        let temp=result.toObject();
        temp.token=generateToken(result._id);
        res.status(200).json(temp);
    } catch (err) {
        return res.status(400).json({ error: err });
    }
});
router.get('/getdata/:id', protect, async(req, res) => {
    try {
        console.log(req.params.id)
        const result = await User.findById(req.params.id).select("-password");
        console.log(result);
        res.status(200).json(result);
    } catch(err) {
        return res.status(400).json({error: err});
    }
})
module.exports = router;