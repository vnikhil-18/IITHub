import React from 'react';
import Header from '../Components/Header';
import Project from '../Components/Research-card';
import CardGroup from 'react-bootstrap/CardGroup';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/chatProvider';
import axios from 'axios';
import './../Components/Styles/research.css';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { TypeAnimation } from 'react-type-animation';
import Button from 'react-bootstrap/Button';
import { IoMdAdd } from 'react-icons/io';

function Research() {
  const {
    user,
  } = ChatState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState("http://res.cloudinary.com/dq7oyedtj/image/upload/v1699164162/kvj75q0lbch6bwg7xhb2.png");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const postDetails = (image) => {
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
          setImage(data.url.toString());
        })
        .catch((error) => {
          console.log(error);
        })
    }
    else {
      alert("Please Select an Valid jpeg or png Image");
      return;
    }

  }
  async function onSubmit() {
    handleClose();
    const titleValue = document.getElementById('form.1').value.toString();
    const professorValue = document.getElementById('form.2').value.toString();
    const instituteValue = document.getElementById('form.3').value.toString();
    const descriptionValue = document.getElementById('form.4').value.toString();
    const abstractValue = document.getElementById('form.5').value.toString();
    const picValue = image;
    if (!titleValue || !professorValue || !instituteValue || !descriptionValue || !abstractValue) {
      alert('Please fill all the fields');
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', titleValue);
    formData.append('professor', professorValue);
    formData.append('institute', instituteValue);
    formData.append('description', descriptionValue);
    formData.append('abstract', abstractValue);
    formData.append('pic', picValue);
    console.log(formData);

    axios.post('http://localhost:5000/api/research/', formData, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      console.log(response);
      navigate('/Research');
    }).catch((error) => {
      console.log(error);
    });

    document.getElementById('form.1').value = '';
    document.getElementById('form.2').value = '';
    document.getElementById('form.3').value = '';
    document.getElementById('form.4').value = '';
    document.getElementById('form.5').value = '';

  }


  const [searchText, setSearchText] = useState('');
  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  function DisplayCards() {
    const [projects, setProjects] = useState([]);
    const fetchData = async () => {
      console.log('Fetching data...');
      try {
        setLoading(true);
        if (!user) return console.log('No user');
        const response = await axios.get('http://localhost:5000/api/research/', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const projectsData = response.data;
        setProjects(projectsData);
        console.log(projectsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    useEffect(() => {
      console.log('useEffect called');
      fetchData();
    }, [user]);
    const [loading, setLoading] = React.useState(false);
    const filteredProjects = projects.filter((project) =>
      project.title.toLowerCase().includes(searchText.toLowerCase()) ||
      project.professor.toLowerCase().includes(searchText.toLowerCase()) ||
      project.institute.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
      <div className='CardGroup'>
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
        {filteredProjects.map((project, key) => {
          return (
            <Project
              key={key}
              projectInfo={project}
              projectKey={key}
            />
          )
        })}
      </div>
    );
  }

  function GetUserInfo() {
    const userInfo = sessionStorage.getItem('userInfo');
    const addProjectButton = document.querySelector('.addProjectButton');
    if (userInfo) {
      if (JSON.parse(userInfo).userType === 'Professor') {
        if (addProjectButton) {
          addProjectButton.style.display = 'block';
        }
      }
      else {
        if (addProjectButton) {
          addProjectButton.style.display = 'none';
        }
      }
    }
    else {
      console.log('User Not Found');
    }
  }
  useEffect(() => {
    GetUserInfo();
  }, []);
  return (
    <div >
      <Header />
      <div className="templateContainer">
        <div className="searchInput_Container">
          <input
            className="searchInput"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      <div className='research'>
        <CardGroup className='CardGroup'>
          <div>
            <DisplayCards />
          </div>
          <div>
            <GetUserInfo />
            <Modal show={show} onHide={handleClose} size="lg" dialogClassName="modal-80w">
              <Modal.Header closeButton>
                <Modal.Title>Add Your Project</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="form.1">
                    <Form.Label>Title of the project</Form.Label>
                    <Form.Control placeholder="Title" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="form.2">
                    <Form.Label>Name of the professor</Form.Label>
                    <Form.Control placeholder="Professor's Name" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="form.3">
                    <Form.Label>Institute</Form.Label>
                    <Form.Control placeholder="Institute" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="form.4">
                    <Form.Label>Short Description of the Project</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Description" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="form.5">
                    <Form.Label>Abstract</Form.Label>
                    <Form.Control as="textarea" rows={10} placeholder="Abstract" />
                  </Form.Group>
                  <Form.Group controlId="formFile" className="mb-3" style={{ padding: '5px' }} onChange={(e) => setSelectedFile(e.target.files[0])}>
                    <Form.Label>Upload the file relevant to the Project (Optional)</Form.Label>
                    <Form.Control type="file" multiple />
                  </Form.Group>
                  <Form.Group controlId="formFile2" className="mb-3" style={{ padding: '5px' }}>
                    <Form.Label>Display Image of the Project (Optional)</Form.Label>
                    <Form.Control type="file" accept="image/*" multiple onChange={
                      (e) => {
                        const file = e.target.files[0];
                        setSelectedImage(file);
                        postDetails(file);
                      }
                    } />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </CardGroup>
      </div>
      <div>
        <button className='btn btn-success addProjectButton' onClick={handleShow}>
          <span className='addProjectText'>Add Project</span>
          <IoMdAdd className='addProjectIcon' style={{ marginRight: '5px' }} />
        </button>
      </div>
    </div>
  );
}

export default Research;