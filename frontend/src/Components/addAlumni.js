import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {ChatState} from '../context/chatProvider';
import axios from 'axios';
function AlumniCard(props) {
  const accessChat = async (userId) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    // console.log(userId);
    try {
      const {data} = await axios.post (
        `http://localhost:5000/api/chat`,
        {userId},
        config
      );
      console.log (data);
      if (chats.find (chat => chat._id === data._id))
        setChats ([data, ...chats]);
      setSelectedChat (data);
      console.log(selectedChat);
    } catch (error) {
      console.log (error);
    }
  };
  const cardStyle = {
    width: '20rem',
    height: '475px',
    backgroundColor: '#e4e7ed',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const imageStyle = {
    width: '319px',
    height: '300px',
  };

  const cardTitleStyle = {
    color: '#000', 
  };

  const cardTextStyle = {
    color: '#333',
  };

  const buttonStyle = {
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',
  };
  const {
    chats,
    user,
    setChats,
    selectedChat,
    setSelectedChat
  } = ChatState();
  const navigate=useNavigate();
  return (
    <div className="mx-2 my-2">
      <Card style={cardStyle}>
        <Card.Img variant="top" src={props.pic} style={imageStyle} />
        <Card.Body>
          <Card.Title style={cardTitleStyle}>{props.name}</Card.Title>
          <Card.Text style={cardTextStyle}>
            <span>{props.company}</span> <br />
            <span>{props.collegeName}</span>
          </Card.Text>
            {props.openMsg&& <Button variant="primary" style={buttonStyle} onClick={()=>{
              accessChat(props.id);
              navigate('/personalchat');
            }}>Chat</Button>}
        </Card.Body>
      </Card>
    </div>
  );
}

export default AlumniCard;
