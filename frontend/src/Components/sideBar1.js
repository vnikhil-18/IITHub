import React from 'react';
import './Styles/sideBar1.css';
import Subjects from './Subjects.js';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
// import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { ChatState } from '../context/chatProvider';

function Sidebar({ branch, onSelect }) {
  const { user, } = ChatState();
  // const navigate = useNavigate();
  const [subs, setSubs] = useState([]);
  const GetSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/academics/subjects', { params: { branchName: branch } });
      if (response.status === 200) {
        setSubs(response.data);
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };
  useEffect(() => {
    GetSubjects();
  }, [user, subs]);

  const handleSubjectClick = (subjectName) => {
    onSelect(subjectName);
  };


  const reqSubject = () => {
    const sub = document.getElementById('sub').value.toString();
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      }
    }
    try {
      const response = axios.post('http://localhost:5000/api/academicAdmin/', { user: user, Subject: sub, Branch: branch }, config);
      console.log(branch + " " + sub)
      if (response) {
        alert("Request Sent");
      }
      else {
        alert("Request not sent");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='sidebar'>
      <div className="sidebar__header">
        <h5>{branch}</h5>
      </div>
      <div className="sidebar_subjects">
        {subs.map((sub, key) => (
          <Subjects key={key} subject={sub.name} onClick={() => handleSubjectClick(sub.name)} />
        ))}
      </div>
      <div className="add_subject__wrapper">
        <Form>
          <Form.Group className="mb-3" controlId="sub">
            <div className="d-flex">
              <Form.Control placeholder="Enter Subject" style={{ marginLeft: '1rem', marginRight: '1rem', padding: '5px' }} />
              <Button onClick={reqSubject} variant='success' className='my-2'>Request</Button>
            </div>
          </Form.Group>
        </Form>
      </div>

    </div>
  )
}

export default Sidebar