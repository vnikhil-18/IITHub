const asyncHandler = require('express-async-handler');
const { Branch, Subject, Question } = require('../Models/BranchModel');
const fileUpload = require('express-fileupload');
const binary = require('mongodb').Binary;
const fs = require('fs');
const path = require('path');

const getBranches = asyncHandler(async (req, res) => {
  try {
    const foundlists = await Branch.find({}).select('name');
    res.json(foundlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

const getSubjects = asyncHandler(async (req, res) => {
  const { branchName } = req.query;
  try {
    const branch = await Branch.findOne({ name: branchName });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    const subs = branch.subjects;
    res.status(200).json(subs);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const addBranch = asyncHandler(async (req, res) => {
  const { branch } = req.body;
  // console.log(branch);
  const set = [];
  const NewBranch = {
    name: branch,
    subjects: set
  }
  try {
    const NB = await Branch.create(NewBranch);
    res.status(200).send(NB);
  } catch (error) {
    res.status(400);
    console.log(error.message);
  }
})
const searchBranch = asyncHandler(async (req, res) => {
  const branch = req.params.name ? {
    $or: [
      { name: { $regex: req.params.name, $options: 'i' } },
    ]
  }
    : {};
  const branchlist = await Branch.find(branch);
  res.send(branchlist);
})
const deleteBranch = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(id)
  if (!id) {
    res.status(400).send({ message: 'Request missing id parameter' });
  }
  await Branch.findByIdAndDelete(id);
  res.send({ message: 'Branch Deleted' });
});

const addSubject = asyncHandler(async (req, res) => {
  const { branchName, subjectName } = req.body;

  try {
    const branch = await Branch.findOne({ name: branchName });

    if (!branch) {
      console.log("Branch not found");
    }
    const newSubject = {
      name: subjectName,
      questions: []
    };
    branch.subjects.push(newSubject);
    await branch.save();
    res.status(200).json(branch);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const addQuestion = asyncHandler(async (req, res) => {
  const { branchName, subjectName, question, postedBy, userEmail } = req.body;

  try {
    const branch = await Branch.findOne({ name: branchName });

    if (!branch) {
      console.log("Branch not found");
    }
    const subject = branch.subjects.find((sub) => sub.name === subjectName);
    if (!subject) {
      console.log("Subject not found");
    }
    if (req.files !== undefined) {
      const fileData = req.files.file.data;
      const binaryData = Buffer.from(fileData, 'base64');
      const newQuestion = {
        PostedBy: postedBy,
        userEmail: userEmail,
        question: req.files.file.name,
        file: new binary(binaryData),
        answers: [],
        views: 0,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: []

      }
      subject.questions.push(newQuestion);
    }
    else {
      const newQuestion = {
        PostedBy: postedBy,
        userEmail: userEmail,
        question: question,
        answers: [],
        views: 0,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: []
      };
      subject.questions.push(newQuestion);
    }

    await branch.save();
    res.status(200).json(subject.questions[subject.questions.length - 1]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getQuestions = asyncHandler(async (req, res) => {
  const { branchName, subjectName } = req.query;
  try {
    const branch = await Branch.findOne({ name: branchName });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (subjectName === undefined) {
      res.status(200).json([]);
    }
    else {
      const subject = branch.subjects.find((sub) => sub.name === subjectName);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      const questions = subject.questions;
      res.status(200).json(questions);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

});

const postAnswers = asyncHandler(async (req, res) => {
  try {
    const { postedBy, branchName, subjectName, questionId, answer } = req.body;

    const branch = await Branch.findOne({ name: branchName });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    const subject = branch.subjects.find((sub) => sub.name === subjectName);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const question = subject.questions.find((ques) => ques.id === questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const newAnswer = { answer: answer, postedBy: postedBy };
    question.answers.push(newAnswer);
    await branch.save();
    res.status(200).json(question.answers[question.answers.length - 1]);
  } catch (error) {
    console.error('Error occurred while posting answer', error);
    res.status(500).json({ message: 'Failed to post answer' });
  }
});

const getQuestionAndAnswers = asyncHandler(async (req, res) => {
  const { branchName, subjectName, questionId } = req.query;
  try {
    const branch = await Branch.findOne({ name: branchName });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    const subject = branch.subjects.find((sub) => sub.name === subjectName);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    const question = subject.questions.find((ques) => ques.id === questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    const answers = question.answers;
    res.status(200).json({ question, answers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const downloadFile = asyncHandler(async (req, res) => {
  const { branchName, subjectName, questionId } = req.query;
  try {
    const branch = await Branch.findOne({ name: branchName });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (subjectName === undefined) {
      res.status(200).json([]);
    }
    else {
      const subject = branch.subjects.find((sub) => sub.name === subjectName);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      const question = subject.questions.find((ques) => ques.id === questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      let buffer = question.file;
      let name = question.question;
      fs.writeFileSync(path.join(__dirname, '../../frontend/public', name), buffer);
      res.json({ status: name }).status(200);
    }

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Internal Server Error" });
  }
});


const sendMail = asyncHandler(async (req, res) => {
  try {
    const { userEmail, questionId } = req.query;
    const nodemailer = require('nodemailer');
    const Mailgen = require('mailgen');
    const { EMAIL, PASSWORD } = require('../env.js')
    let config = {
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    }
    const transporter = nodemailer.createTransport(config);

    let mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'IIT HUB',
        link: 'https://mailgen.js/'
      }
    });

    let response = {
      body: {
        name: 'IIT HUB',
        intro: 'Welcome to the IIT HUB! We are very excited to have you on board.',
        outro: 'PLease check your question page in IIT HUB for answer of your question'
      }
    };

    let mail = mailGenerator.generate(response);

    let message = {
      from: '"IIT_HUB@iit" <IIT_HUB@gmail.com>',
      to: userEmail,
      subject: 'Your question has been answered',
      text:'Please check your question page in IIT HUB for answer of your question',
      html: mail
    };

    transporter.sendMail(message).then(() => {
      return res.status(200).json({ message: "Mail Sent" });
    }).catch((err) => {
      return res.status(400).json({ message: "Mail not sent" });
    });

    console.log("Mail Sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const details = asyncHandler(async (req, res) => {
  const { action, userId, questionId, branchName, subjectName } = req.body;
  try {
    const branch = await Branch.findOne({ name: branchName });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const subject = branch.subjects.find((sub) => sub.name === subjectName);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const question = subject.questions.find((ques) => ques.id === questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    const hasUserLiked = question.likedBy.some(user => user.equals(userId));
    const hasUserDisliked = question.dislikedBy.some(user => user.equals(userId));
    // console.log(action, hasUserLiked, hasUserDisliked);
    if (action === "like") {
      if (!hasUserLiked) {
        question.likes += 1;
        question.likedBy.push(userId);
      } else {
        question.likes -= 1;
        question.likedBy.pull(userId);
      }
    } else if (action === "dislike") {
      if (!hasUserDisliked) {
        question.dislikes += 1;
        question.dislikedBy.push(userId);
      }
      else {
        question.dislikes -= 1;
        question.dislikedBy.pull(userId);
      }
    } else if (action === "view") {
      question.views += 1;
    }

    await branch.save();
    res.status(200).json({ likeStat: hasUserLiked, dislikeStat: hasUserDisliked });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = { getBranches, addBranch, getSubjects, addSubject, addQuestion, getQuestions, getQuestionAndAnswers, postAnswers, searchBranch, deleteBranch, sendMail, downloadFile, details };

