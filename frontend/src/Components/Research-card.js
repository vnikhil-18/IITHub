import React from 'react';
import {useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { ChatState } from '../context/chatProvider';
import {useNavigate} from 'react-router-dom';
import {MdDelete} from 'react-icons/md';
import './Styles/research.css'

function Project(props) {
  const {
    user,
  } = ChatState();
  const navigate = useNavigate();
  const info_click = () => {
    navigate('/research/projectdetails', { state: { project: props.projectInfo } });
  };

  async function onDeleteClick() {
    const confirmation = window.confirm('The project would be deleted permanently..!');
    if (!confirmation) {
        return;
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        },
    };
    try {
        const res = await axios.delete(`http://localhost:5000/api/research/${props.projectInfo._id}`, config);
        console.log(res);
        window.location.reload();
    } catch (err) {
        console.error('Error deleting project:', err);
    }
}

  function displayDeleteButton() {
    const userInfo = sessionStorage.getItem('userInfo');
    const key= props.projectKey;
    const deleteButton= document.getElementsByClassName('deleteButton')[key];
    if(userInfo){
      const uid= JSON.parse(userInfo)._id;
      if(uid===props.projectInfo.user?._id){
        deleteButton.style.display= 'block';
      }
      else {
        deleteButton.style.display= 'none';
      }
    }

  }
  useEffect(() => {
    displayDeleteButton();
  }, []);

  
  const cardStyle = {
    width: '20rem',
    height: '550px',
    backgroundColor: '#e4e7ed', 
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
    color: '#fff', 
  };
  const cardTitleStyle = {
    color: '#000', 
  };
  const cardTextStyle = {
    height: '150px',
    overflow: 'hidden',
    color: '#333', 

  };

  const infoButtonStyle = {
    backgroundColor: '#0056b3', 
    borderColor: '#0056b3', 
    color: '#fff',
  };

  const deleteButtonStyle = {
    display: 'none',
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',  
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  return (
    <div className="mx-2 my-2">
      <Card style={cardStyle}>
        <Card.Img variant="top" src={props.projectInfo.img} style={imageStyle}/>
        <Card.Body>
          <Card.Title style={cardTitleStyle}>{props.projectInfo.title}</Card.Title>
          <Card.Text style={cardTextStyle}>
            {props.projectInfo.professor} <br/>
            {props.projectInfo.institute} <br/>
            {props.projectInfo.updatedAt.substring(0,10)} <br/>
            {props.projectInfo.description}
          </Card.Text>
        </Card.Body>
        <div className='cardButtons my-3'>
          <Button variant="info" onClick={info_click} className='mx-2' style={infoButtonStyle}>Get Info</Button>
            <Button variant="danger" className="deleteButton btn btn-danger" style={deleteButtonStyle} onClick={onDeleteClick}>
            Delete Project <MdDelete style={{marginLeft: '5px'}}/>
            </Button>
        </div>
      </Card>
    </div>
  );
}

export default Project;