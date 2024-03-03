import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';
import '../Components/Styles/QuestionAnswers.css';
import { ChatState } from '../context/chatProvider';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { TypeAnimation } from 'react-type-animation';

function QuestionAnswers() {
  const { questionId } = useParams();
  const branch = new URLSearchParams(window.location.search).get('branch');
  const selectedSubject = new URLSearchParams(window.location.search).get('selectedSubject');
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    user
  } = ChatState();

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`http://localhost:5000/api/academics/subjects/questions/answers`, {
          params: {
            branchName: branch,
            subjectName: selectedSubject,
            questionId: questionId,
          },
        });
        const { question, answers } = response.data;
        setQuestion(question);
        setAnswers(answers);
        setLoading(false);
      } catch (error) {
        console.error('Error occurred while fetching answers', error);
      }
    };

    fetchQuestionAndAnswers();
  }, [questionId]);

  const func = async () => {
    const tem = await Axios.get(`http://localhost:5000/api/academics/sendMail`, {
      params: {
        userEmail: question.userEmail,
        questionId: questionId,
      },
    });
    console.log(tem);
  }
  const handlePostAnswer = async () => {
    try {
      setLoading(true);
      const response = await Axios.post(`http://localhost:5000/api/academics/subjects/questions/answers`, {
        postedBy: user.name,
        branchName: branch,
        subjectName: selectedSubject,
        questionId: questionId,
        answer: newAnswer,
      });
      if (response.status === 200) {
        console.log('Answer posted successfully');
        setAnswers([...answers, response.data]);
        console.log(question.userEmail);
        setNewAnswer('');
        func();
        setLoading(false);
      } else {
        console.error('Failed to post answer');
      }
    } catch (error) {
      console.error('Error occurred while posting answer', error);
    }
  };


  return (
    <div className={`discuss ${answers.length > 0 ? 'has-answers' : ''}`}>
      {
        loading && <Modal centered show={loading}>
          <Modal.Body>
            <Spinner />
            <TypeAnimation
              sequence={["Loading ..!!!.",]}
              cursor=""
              speed={5}
              style={{ fontSize: "1rem", marginLeft: "1rem" }}
            />
          </Modal.Body>
        </Modal>
      }
      <div className="discuss__header_question">
        <h3>{question.question}</h3>
      </div>
      <div className='discuss_body'>
        <h5>Answers: {answers.length}</h5>
        {answers.map((answer, key) => (
          <div className="discuss_answer" key={key}>
            <p>Posted by: <b>{answer.postedBy}</b></p>
            <p>{answer.answer}</p>
          </div>
        ))}
      </div>
      <div className='post_answer__wrapper'>
        <Form className="post_answer__form">
          <Form.Group controlId="answerForm" className="mb-3" style={{ display: 'flex' }}>
            <Form.Control
              type="text"
              placeholder="Your Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <button type="button" onClick={handlePostAnswer}>Post Answer</button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

export default QuestionAnswers;
