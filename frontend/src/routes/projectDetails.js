import React from 'react';
import './../Components/Styles/research.css';
import { ChatState } from '../context/chatProvider';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../Components/Styles/projectdetails.css';
import Button from 'react-bootstrap/Button';
import { BsDownload } from 'react-icons/bs';

function ProjectDetails() {
  const { user } = ChatState();
  const location = useLocation();
  const project = location.state.project;

  const downloadFile = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/research/download/${project._id}`,
        config
      );
      const fileURL = "/" + data.status;
      let alink = document.createElement("a");
      alink.href = fileURL;
      alink.download = data.status;
      alink.click();
    }
    catch (error) {
      console.error(error);
    }
  }



  return (
    <div className='projectdetails'>
      <div className='projectdetails'>
        <h1>Details of the project</h1>
        <div className='projectdetails'>
          <h4>Title:</h4>
          <p>{project.title}</p>
        </div>
        <div className='projectdetails'>
          <h4>Professor:</h4>
          <p>{project.professor}</p>
        </div>
        <div className='projectdetails'>
          <h4>Professor's Email</h4>
          <p>{project.email ? project.email : "Not Available"}</p>
        </div>
        <div className='projectdetails'>
          <h4>Description:</h4>
          <p style={{ whiteSpace: 'break-spaces' }}>{project.description}</p>
        </div>
        <div className='projectdetails'>
          <h4>Institute:</h4>
          <p>{project.institute}</p>
        </div>
        <div className='projectdetails'>
          <h4>Date:</h4>
          <p>{project.updatedAt.substring(0, 10)}</p>
        </div>
        <div className='projectdetails'>
          <h4>Abstract:</h4>
          <p style={{ whiteSpace: 'break-spaces' }}>{project.abstract}</p>
        </div>
        {project.file &&
          <div className='projectdetails' style={{ display: 'flex', alignItems: 'center' }}>
            <h4>Download File:</h4>
            <Button variant='primary' onClick={downloadFile} style={{ marginLeft: '10px' }}>
              <BsDownload height='5px' />
            </Button>
          </div>
        }
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button variant='primary' href='/research' style={{ padding: '10px 20px' }}>Back</Button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;