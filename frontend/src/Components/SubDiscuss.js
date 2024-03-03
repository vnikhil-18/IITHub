import React from 'react'
import './Styles/subDiscuss.css';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChatState } from '../context/chatProvider';
import { FiPlusSquare } from 'react-icons/fi';
import Dropdown from 'react-bootstrap/Dropdown';
import { BiCloudUpload } from 'react-icons/bi';
import { CgSoftwareDownload } from 'react-icons/cg';
import CloseButton from 'react-bootstrap/CloseButton';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { TypeAnimation } from 'react-type-animation';
import { FaSearch } from 'react-icons/fa';
import { FaEye, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';


function SubDiscuss({ branch, selectedSubject }) {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLikedQuestions, setUserLikedQuestions] = useState([]);
  const [userDislikedQuestions, setUserDislikedQuestions] = useState([]);


  async function onSubmit() {
    if (!selectedFile) {
      alert("Please select a file");
      console.log("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append('branchName', branch);
    formData.append('subjectName', selectedSubject);
    formData.append('postedBy', user.name);
    formData.append('file', selectedFile);
    try {
      const resp = await Axios.post('http://localhost:5000/api/academics/subjects/questions', formData)
      document.getElementById("lightbox3").style.display = "none";
      setQuestions([...questions, resp.data]);
    }
    catch (err) {
      console.error(err);
    }
  };


  const hasUserLikedQuestion = (questionId) => {
    return userLikedQuestions.includes(questionId);
  };

  const hasUserDislikedQuestion = (questionId) => {
    return userDislikedQuestions.includes(questionId);
  };

  const downloadFile = async (buffer) => {
    console.log(buffer)
    try {
      const { data } = await Axios.get(`http://localhost:5000/api/academics/subjects/question`, {
        params: {
          branchName: branch,
          subjectName: selectedSubject,
          questionId: buffer._id,
        },
      });
      const fileURL = "/" + data.status;
      let alink = document.createElement("a");
      alink.href = fileURL;
      alink.download = data.status;
      alink.click();
    } catch (error) {
      console.error(error);
    }
  }

  const {
    user
  } = ChatState();
  const [questionsFetched, setQuestionsFetched] = useState(false);

  function upload() {
    document.getElementById("lightbox3").style.display = "block";
  }

  const fetchQuestions = async () => {

    setLoading(true);
    try {

      const response = await Axios.get('http://localhost:5000/api/academics/subjects/questions', {
        params: {
          branchName: branch,
          subjectName: selectedSubject,
        },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        setQuestionsFetched(true);
        setQuestions(response.data);
      }
      else {
        setQuestionsFetched(false);
      }
      setLoading(false);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error occurred while fetching questions', error);
    }
  }
  useEffect(() => { fetchQuestions(); }, [selectedSubject]);


  const handlePostQuestion = async () => {
    setLoading(true);
    try {
      const response = await Axios.post('http://localhost:5000/api/academics/subjects/questions', {
        postedBy: user.name,
        userEmail: user.email,
        branchName: branch,
        subjectName: selectedSubject,
        question: question,
      });

      if (response.status === 200) {
        console.log('Question posted successfully');
        setLoading(false);
        setQuestions([...questions, response.data]);
        document.getElementById('br').value = '';
        setQuestion('');
        setQuestionsFetched(true);

      } else {
        setLoading(false);
        console.error('Failed to post question');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error occurred while posting question', error);
    }

  };
  const handleViewIncrement = async (questionId) => {
    try {
      const questionIndex = questions.findIndex(question => question._id === questionId);
      if (questionIndex === -1) {
        console.error(`Question with ID ${questionId} not found`);
        return;
      }
      setQuestions(prevQuestions => {
        const updatedQuestions = [...prevQuestions];
        const updatedQuestion = { ...updatedQuestions[questionIndex] };
        updatedQuestion.views += 1;
        updatedQuestions[questionIndex] = updatedQuestion;
        return updatedQuestions;
      });
      await Axios.put('http://localhost:5000/api/academics/subjects/questions/select', {
        action: "view",
        questionId: questionId,
        branchName: branch,
        subjectName: selectedSubject,
      },);

    } catch (error) {
      console.error('Error updating views', error);
    }
  };

  const handleLike = async (questionId) => {
    try {
      const reponse = await Axios.put('http://localhost:5000/api/academics/subjects/questions/select', {
        action: 'like',
        userId: user._id,
        questionId: questionId,
        branchName: branch,
        subjectName: selectedSubject,
      });
      if (reponse.data.likeStat === false) {
        setUserLikedQuestions((prevLikedQuestions) => [...prevLikedQuestions, questionId]);
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId ? { ...q, likes: q.likes + 1 } : q
          )
        );
      }
      else {
        setUserLikedQuestions((prevLikedQuestions) => [...prevLikedQuestions, questionId]);
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId ? { ...q, likes: q.likes - 1 } : q
          )
        );
      }
    } catch (error) {
      console.error('Error updating question: like', error);
    }
  };

  const handleDislike = async (questionId) => {
    try {
      const reponse = await Axios.put('http://localhost:5000/api/academics/subjects/questions/select', {
        action: 'dislike',
        userId: user._id,
        questionId: questionId,
        branchName: branch,
        subjectName: selectedSubject,
      });
      console.log(reponse.data.dislikeStat);
      if (reponse.data.dislikeStat === false) {
        setUserDislikedQuestions((prevDislikedQuestions) => [...prevDislikedQuestions, questionId]);
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId ? { ...q, dislikes: q.dislikes + 1 } : q
          )
        );
      }
      else {
        setUserDislikedQuestions((prevDislikedQuestions) => [...prevDislikedQuestions, questionId]);
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId ? { ...q, dislikes: q.dislikes - 1 } : q
          )
        );
      }
    } catch (error) {
      console.error('Error updating question: dislike', error);
    }
  };

  const handleSearch = (query) => {
    const filtered = questions.filter((question) =>
      question.question.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredQuestions(filtered);
  };
  return (
    <div className={`discuss ${questionsFetched ? ' background-image-hidden' : ''}`}>
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
      <div className="discuss__header">
        <h3><b>{selectedSubject ? selectedSubject : 'Subject Discussions'}</b></h3>
      </div>
      <div className='discuss_body'>
        {(selectedSubject && questions.length > 0) && (
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search questions"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
        )}

        {!loading &&
          (filteredQuestions.length > 0
            ? filteredQuestions.map((question, key) => (
              <div className='discuss_question' key={key}>
                <Link
                  to={{
                    pathname: `/answers/${question._id}`,
                    search: `?branch=${branch}&selectedSubject=${selectedSubject}`,
                  }}
                  className='custom-link'
                  onClick={() => handleViewIncrement(question._id)}>
                  <p>Posted By: <b>{question.PostedBy}</b></p>
                  <h5>{question.question}</h5>
                </Link>
                <p>
                  {question.file && (
                    <CgSoftwareDownload
                      style={{
                        marginLeft: "1rem",
                        marginRight: "0.5rem",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                      size={25}
                      onClick={() => {
                        downloadFile(question);
                      }}
                    />
                  )}
                </p>

                <div className="question-actions">
                  <div className="action-buttons">
                    <div>
                      <FaEye />
                      <p>{question.views}</p>
                    </div>
                    <div>
                      <button onClick={() => handleLike(question._id)}>
                        <FaThumbsUp />
                      </button>
                      <p>{question.likes}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDislike(question._id)}>
                        <FaThumbsDown />
                      </button>
                      <p>{question.dislikes}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
            : questions.map((question, key) => (
              <div className='discuss_question' key={key}>
                <Link
                  to={{
                    pathname: `/answers/${question._id}`,
                    search: `?branch=${branch}&selectedSubject=${selectedSubject}`,
                  }}
                  className='custom-link'
                  onClick={() => handleViewIncrement(question._id)}>
                  <p>Posted By: <b>{question.PostedBy}</b></p>
                  <h5>{question.question}</h5>
                </Link>
                <p>
                  {question.file && (
                    <CgSoftwareDownload
                      style={{
                        marginLeft: "1rem",
                        marginRight: "0.5rem",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                      size={25}
                      onClick={() => {
                        downloadFile(question);
                      }}
                    />
                  )}
                </p>

                <div className="question-actions">
                  <div className="action-buttons">
                    <div>
                      <FaEye />
                      <p>{question.views}</p>
                    </div>
                    <div>
                      <button onClick={() => handleLike(question._id)}>
                        <FaThumbsUp />
                      </button>
                      <p>{question.likes}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDislike(question._id)}>
                        <FaThumbsDown />
                      </button>
                      <p>{question.dislikes}</p>
                    </div>
                  </div>
                </div>
              </div>
            )))}
      </div>
      <div id='lightbox3'>
        <div className='content my-5'>
          <BiCloudUpload size={150} color='black' />
          <form>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </form>
          <Button
            className='close2 btn-secondary'
            onClick={() => {
              document.getElementById("lightbox3").style.display = "none";
            }}
            style={{ marginTop: '100px' , marginRight: '10px'}} // Add right margin to the first button
          >Cancel</Button>
          <button className='btn btn-primary' onClick={onSubmit} style={{ marginTop: '100px' }}>Submit</button>
        </div>
      </div>
      {selectedSubject && (
        <div className='post_question__wrapper'>
          <Form className="post_question__form">
            <Form.Group className="mb-3" controlId="br" style={{ display: 'flex' }}>
              <Form.Control
                placeholder="Post your question"
                style={{ marginRight: '10px' }}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePostQuestion();
                  }
                }}
              />
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ width: '3.5rem', marginRight: '3px' }}>
                  <FiPlusSquare size={25} color={"white"} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => {
                    upload();
                  }}>Insert File</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <button type="button" onClick={handlePostQuestion}>POST</button>
            </Form.Group>
          </Form>
        </div>
      )}
    </div>
  )
}

export default SubDiscuss
