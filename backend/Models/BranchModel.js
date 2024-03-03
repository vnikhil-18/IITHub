const mongoose = require("mongoose");

const AnswerSchema = {
    answer: String,
    postedBy: String,
}
const Answer = mongoose.model("Answer", AnswerSchema);


const QuestionSchema = new mongoose.Schema({
    question: String,
    PostedBy: String,
    userEmail: String,
    answers: [AnswerSchema],
    views: Number,
    likes: Number,
    dislikes: Number,
    file: {
        type: Buffer,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});
const Question = mongoose.model("Question", QuestionSchema);


const SubjectSchema = {
    name: String,
    questions: [QuestionSchema]
}
const Subject = mongoose.model("Subject", SubjectSchema);


const BranchSchema = {
    name: String,
    subjects: [SubjectSchema]
}
const Branch = mongoose.model("Branch", BranchSchema);

module.exports = { Branch, Subject, Question };