const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {sendMessage,getMessages,deleteMessage} = require('../Controllers/AcademicAdminController');
router.route('/').post(protect,sendMessage);
router.route('/').get(protect,getMessages);
router.route('/:id').delete(protect,deleteMessage);
module.exports = router;