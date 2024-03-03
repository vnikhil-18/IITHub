import React, { useState, useEffect, useRef } from 'react';
import './Styles/chatPage.css';
import { TypeAnimation } from 'react-type-animation';
import { Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CloseButton from 'react-bootstrap/CloseButton';
import { ChatState } from '../context/chatProvider';
import { FiPlusSquare } from 'react-icons/fi';
import Typewriter from 'typewriter-effect/dist/core';
import {IoIosArrowBack} from 'react-icons/io';
import { BiCloudUpload } from 'react-icons/bi';
import { CgSoftwareDownload } from 'react-icons/cg';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import Col from 'react-bootstrap/Col';
import io from 'socket.io-client';
import { IoMdTrash } from 'react-icons/io';
const EndPoint = "http://localhost:5000";
var socket, selectedChatCompare;
function ChatPage() {
  const {
    selectedChat,
    setSelectedChat,
    user,
  } = ChatState();
  const messagesEndRef = React.useRef(null);
  useEffect(() => {
    socket = io(EndPoint);
    if (user) {
      socket.emit('setup', user);
      socket.on("connected", () => {
        console.log("FrontEnd : Socket connected");
        setSocketConnected(true);
        socket.on("typing", () => {
          setIsTyping(true);
        });
        socket.on("stop typing", () => {
          setIsTyping(false);
        });
      });
    }
  }, [user]);
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    if (!socket) return;
    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedChatCompare || newMessageRecieved.chat._id !== selectedChatCompare._id) {
        //TODO :: give notification
      }
      else {
        console.log("message recieved");
        setMessages([...messages, newMessageRecieved]);
      }
    })
    socket.on('delete msg', () => {
      fetchMessages();
    })
  })
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  async function onSubmit() {
    if (!selectedFile) {
      alert("Please select a file");
      console.log("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    console.log(selectedChat._id);
    formData.append('chatId', selectedChat._id)
    console.log(formData);
    try {
      const { data } = await axios.post('http://localhost:5000/api/messages/', formData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setNewMessage('');
      socket.emit("new msg", data);
      setMessages([...messages, data]);
      document.getElementById("lightbox2").style.display = "none";
    }
    catch (err) {
      console.error(err);
      toast.error('Error in sending message');
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])
  const sendMessage = async () => {
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('http://localhost:5000/api/messages', {
        chatId: selectedChat._id,
        content: newMessage,
      }, config);
      setNewMessage('');
      socket.emit("new msg", data);
      setMessages([...messages, data]);
    } catch (err) {
      console.error(err);
      toast.error('Error in sending message');
    }
  };
  const downloadFile = async (buffer) => {
    console.log(buffer)
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/messages/download/${buffer._id}`, config,);
      console.log(data.status)
      const fileURL = "/" + data.status;
      console.log(fileURL);
      let alink = document.createElement("a");
      alink.href = fileURL;
      alink.download = data.status;
      alink.click();
    } catch (error) {
      console.error(error);
    }
  }
  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/messages/${selectedChat._id}`, config);
      setMessages(data);
      socket.emit("join room", selectedChat._id, user._id);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  function upload() {
    document.getElementById("lightbox2").style.display = "block";
  }
  const handleClose = () => setLoading(false);
  const handleShow = () => setLoading(true);
  const handleClose2 = () => setLoading(false);
  const handleShow2 = () => setLoading(true);
  const [imgClick, setImgClick] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [reason, setReason] = useState(null);
  const [proof, setProof] = useState(null);
  const [reportClick, setReportClick] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const postDetails = (image) => {
    setLoading(true);
    if (image === undefined) {
      alert("Please Select an Valid Image");
      return;
    }
    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "chating");
      data.append("cloud_name", "dq7oyedtj");
      fetch("https://api.cloudinary.com/v1_1/dq7oyedtj/image/upload", {
        method: "post",
        body: data
      }).then(res => res.json())
        .then(data => {
          setProof(data.url.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        })
    }
    else {
      alert("Please Select an Valid jpeg or png Image");
      return;
    }
  }
  const reportToAdmin = async (chatUser) => {
    postDetails(selectedImage);
    console.log(proof)
    if (!proof) {
      toast.error('Please upload a valid image');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.post(`http://localhost:5000/api/admin/`, {
        reqUser: user,
        accusedUser: chatUser,
        reason: reason,
        pic: proof
      }, config);
      toast.success('Reported to admin');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={selectedChat ? "chat-page":"hide"}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} draggable theme="light" />
      {reportClick &&
        <Modal centered show={reportClick} onHide={() => { setReportClick(false); }}>
          <Modal.Header>
            <Modal.Title>Report User</Modal.Title>
            <CloseButton onClick={() => { setReportClick(false) }} />
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="reportReason" className="form-label">Reason</label>
                <textarea className="form-control" id="reportReason" rows="3" onChange={(e) => setReason(e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="reportProof" className="form-label">Proof</label>
                <input type="file" className="form-control" id="reportProof" onChange={(e) => setSelectedImage(e.target.files[0])} />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={() => { setReportClick(false); }}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => { reportToAdmin(chatUser); setReportClick(false); }}>Report</button>
          </Modal.Footer>
        </Modal>}
      {
        imgClick &&
        <Modal centered show={imgClick} onHide={() => { setImgClick(false); }}>
          <Modal.Body>
            <CloseButton onClick={() => { setImgClick(false) }} />
            <button type="button" style={{ float: "right" }}
              className="btn btn-danger" onClick={() => {
                setReportClick(true);
              }}>Report</button>
            <div className="container">
              <div className="row">
                <div className="col d-flex justify-content-center">
                  <img
                    src={selectedChat?.users[0].pic} style={{
                      height: "10.5rem"
                    }} />
                </div>
                <div className="col">
                  <p>Name: {chatUser.name}</p>
                  <p>Email: {chatUser.email}</p>
                  <p>Branch: {chatUser.branch}</p>
                  <p>Role: {chatUser.userType}</p>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      }
      <div className={!selectedChat ? 'passive' : 'chat-header'}>
        <div className="chat-header-user" >
          <Card className='headerCard'>
            <Row>
              <Col>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IoIosArrowBack size={30} style={{marginTop:'10px'}} onClick={() => {
                    setSelectedChat(null);
                  }}/>
                </div>
              </Col>
              <Col>
                <Card.Body className='headerText'>
                  <Card.Text>{selectedChat?.users[0].email !== user?.email ? selectedChat?.users[0].name :
                    selectedChat?.users[1].name}</Card.Text>
                </Card.Body>
              </Col>
              <Col>
                  <Card.Img src={
                    selectedChat?.users[0]._id !== user?._id ? selectedChat?.users[0].pic :
                      selectedChat?.users[1].pic
                  } style={{
                    float:'right',
                    height: "3rem",
                    width: "auto",
                    marginLeft: '5px',
                    marginTop: '5px'
                  }}
                    onClick={() => {
                      setChatUser(selectedChat?.users[0] === user?._id ? selectedChat?.users[1] : selectedChat?.users[0]);
                      setImgClick(true);
                    }} />
              </Col>
            </Row>
          </Card>
        </div>
      </div>
      <div className="chat-container" >
        {
          loading && <Modal centered show={loading}>
            <Modal.Body>
              <Spinner />
              <TypeAnimation
                sequence={["Loading ...",]}
                cursor=""
                speed={5}
                style={{ fontSize: "1rem", marginLeft: "1rem" }}
              />
            </Modal.Body>
          </Modal>
        }
        <div className="message-list" >
          {!loading && messages.map((message, index) => {
            return (
              <div
                key={index}
                className={`message ${message.sender._id === user._id ? 'sent' : 'received'}`}
              >
                <div className="message-card"
                  style={{
                    backgroundColor: message.sender._id === user._id ? '#DCF8C6' : 'white',
                    borderRadius: '10px',
                    marginLeft: '10px',
                    marginBottom: '4px',
                    padding: '10px',
                    boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.1)',
                    display: 'inline-block',
                    maxWidth: '70%',
                    float: message.sender._id === user._id ? 'right' : 'left',
                    clear: 'both'
                  }}
                >
                  <p style={{ margin: 0, padding: 0, display: 'inline-block' }}>
                    {message.content}
                    {message.file && (
                      <CgSoftwareDownload style={{ marginLeft: "1rem", marginTop: "10px", marginBottom: "10px" }} size={25} onClick={() => { downloadFile(message) }} />
                    )}
                    <sub style={{
                      marginLeft: '10px',
                      fontSize: "12px",
                      color: "#888",
                      verticalAlign: "sub",
                      marginTop: "-6px",
                    }}>
                      {message.updatedAt.slice(11, 16)}
                    </sub>
                  </p>
                  {message.sender._id === user._id && <IoMdTrash onClick={async () => {
                    try {
                      const config = {
                        headers: {
                          Authorization: `Bearer ${user.token}`,
                        },
                      };
                      const { data } = await axios.delete(`http://localhost:5000/api/messages/delete/${message._id}`, config);
                      fetchMessages();
                      socket.emit("delete msg", (selectedChat?.users));
                    } catch (error) {
                      console.log(error);
                    }
                  }} />}
                </div>
              </div>)
          })}
          <div ref={messagesEndRef} ></div>
        </div>
      </div>
      <div id='lightbox2'>
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
              document.getElementById("lightbox2").style.display = "none";
            }}
            style={{ marginTop: '100px' , marginRight: '10px'}} // Add right margin to the first button
          >Cancel</Button>
          <button className='btn btn-primary' onClick={onSubmit} style={{ marginTop: '100px' }}>Submit</button>
        </div>
      </div>
      <div className="message-input">
        <div className="typing">
          {isTyping && <p>Typing...</p>}
        </div>
        <InputGroup className={!selectedChat ? 'passive' : ''}>
          <FormControl
            type="text"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(event) => {
              setNewMessage(event.target.value);
              if (!socket) return;
              if (!typing) {
                socket.emit("typing", selectedChat._id);
              }
              let lastTypingTime = Date.now();
              var timerLength = 300;
              setTimeout(() => {
                var timeNow = Date.now();
                var timeDiff = timeNow - lastTypingTime;
                if (timeDiff >= timerLength && typing) {
                  socket.emit("stop typing", selectedChat._id);
                  setTyping(false);
                }
              });
            }}
            onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
          />
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <FiPlusSquare size={25} color={"white"} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {
                upload();
              }}>Insert File</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="primary" className="sendbutton" onClick={sendMessage}>Send</Button>
        </InputGroup>
      </div>

    </div>
  );
}
export default ChatPage;
