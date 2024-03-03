const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {protect} = require('../middleware/authMiddleware');
const Post = require('../Models/postModel');
router.get('/allpost',protect,async(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic email branch userType")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
    
})

router.get('/getsubpost',protect,async(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',protect,async(req,res)=>{
    const {title,body,pic} = req.body 
    console.log(req.body)
    if(!title || !body || !pic){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        console.log(post)
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',protect,async(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', protect, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user._id }
        }, {
            new: true
        }).exec();
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});
router.put('/unlike', protect, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true
        }).exec();
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});


router.put('/comment', protect, async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    };
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        }, {
            new: true
        })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec();
        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});
router.delete('/deletepost/:postId', protect, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId })
            .populate("postedBy", "_id")
            .exec();
        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            const result = await Post.findByIdAndRemove(req.params.postId);
            res.json(result);
        } else {
            res.status(401).json({ error: "You can only delete your own posts" });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;