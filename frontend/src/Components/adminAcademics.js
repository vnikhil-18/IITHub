import React, { useState, useEffect } from 'react'
import './Styles/admin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ChatState } from '../context/chatProvider';
import { Button } from 'react-bootstrap';
import { Modal, CloseButton } from 'react-bootstrap';
export default function AdminAcademics() {
  const navigate = useNavigate();
  const {
    user
  } = ChatState();
  async function addSubject(data) {
    try {
      const response = await axios.post('http://localhost:5000/api/academics/subjects', {
        branchName: data.branch, subjectName: data.sub
      });
      if (response.status === 200) {
        // navigate(`/Academic/${br}`);
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (err) {
      console.error("Error submitting the project:", err);
    }
  }

  async function addBranch() {
    const br = document.getElementById('br').value.toString();
    try {
      const response = await axios.post('http://localhost:5000/api/academics/', { branch: br, });
      if (response.status === 200) {
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (err) {
      console.error("Error submitting the project:", err);
    }
  }
  const [data, setData] = useState([])
  const getMessages = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.get('http://localhost:5000/api/academicAdmin', config);
      return data;
    } catch (error) {
    }
  }
  useEffect(() => {
    getMessages();
    console.log(data);
  }, [])
  useEffect(() => {
    if (!user) return;
    getMessages().then((data) => {
      setData(data);
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  })
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = useState();
  const searchBranch = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/academics/search/${search}`);
      console.log(data);
      setSearchData(data);
    } catch (error) {
      console.log(error);
    }
  }
  const deleteBranch = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/academics/delete/${id}`);
      console.log(data);
      toast.success('Branch Deleted');
    } catch (error) {
      console.log(error);
    }
  }
  const deleteMessage = async (id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      await axios.delete(`http://localhost:5000/api/academicAdmin/${id}`, config);
      toast.success('Message Deleted');
    } catch (error) {
      console.log(error)
    }
  }
  const [visible,setVisible]=useState(false);
  const [subject,setSubject]=useState();
  const [branch,setBranch]=useState();
  return (
    <div className='adminAcad'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
      {visible && <Modal centered show={visible} onHide={()=>{setVisible(null)} }>
              <Modal.Header>
                <Modal.Title>Add New Subject In </Modal.Title>
                <CloseButton onClick={()=>{setVisible(null)}} />
              </Modal.Header>
              <Modal.Body>
                <p>Subject Name:</p><input type="text" onChange={
                  (e)=>{
                    setSubject(e.target.value);
                  }
                } />
              </Modal.Body>
              <Modal.Footer>
                <button type="button" className="btn btn-primary" onClick={()=>{
                  addSubject();
                  setVisible(false);
                }}>Add Interest</button>
              </Modal.Footer>
            </Modal>}
      <div className="row">
        <div className="col-md-4 border-box">
          <h4>Requests</h4>
          {
            data.map((val, key) => {
              return (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                  marginTop: '10px',
                }}>
                  {val.Subject ? <div>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', }}>
                      {"To Add Subject : " + val.Subject}</p>
                    <h6>In Branch : {val.Branch}</h6>
                  </div> : <div>
                    <h5>Add Branch : {val.Branch}</h5>
                  </div>}
                  <div>
                    <button className="btn btn-danger" onClick={() => {
                      deleteMessage(val._id);
                    }}>Delete Message</button>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="col-md-4 border-box">
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <h3>Add Branch</h3>
              <input type="text" id="br" placeholder="Branch Name" style={{ height: '40px' , borderRadius: '5px', margin: '2px' }} />
              <Button onClick={addBranch}>Add</Button>
            </div>
            <div style={{ flex: 1 }}>
              <h3>Search & Delete Branch</h3>
              <input type="text" style={{ height: '40px', borderRadius: '5px' , margin: '2px' }} placeholder="Branch Name" onChange={(e) => {
                setSearch(e.target.value);
              }
              } />
              <Button onClick={() => {
                searchBranch();
              }
              }>Search</Button>{
                searchData.map((val, key) => {
                  return (
                    <div key={key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '10px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#fff',
                      marginTop: '10px',
                    }}>
                      <h4>{val.name}</h4>
                      <button  className="btn btn-primary" onClick={()=>{
                            setBranch(val.name)
                            setVisible(true);
                          }}>Add Subject</button>
                      <button style={{ float: 'right' }} className="btn btn-danger" onClick={() => {
                        { console.log(val._id) }
                        deleteBranch(val._id);
                      }}>Delete</button>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
