const express = require('express');
const router = express.Router();
const { getBranches, addBranch, getSubjects, addSubject, addQuestion, getQuestions, getQuestionAndAnswers, postAnswers,
    searchBranch, deleteBranch, sendMail, downloadFile, details } = require('../Controllers/BranchController');
const { protect } = require('../middleware/authMiddleware');

router.route("/").get(getBranches);
router.route("/").post(addBranch);
router.route("/sendMail").get(sendMail);
router.route("/subjects").get(getSubjects);
router.route("/subjects").post(addSubject);
router.route("/search/:name").get(searchBranch);
router.route("/delete/:id").delete(deleteBranch);
router.route("/subjects/question").get(downloadFile);
router.route("/subjects/questions/select").put(details);
router.route("/subjects/questions").post(addQuestion);
router.route("/subjects/questions").get(getQuestions);
router.route("/subjects/questions/answers").post(postAnswers);
router.route("/subjects/questions/answers").get(getQuestionAndAnswers);
module.exports = router;