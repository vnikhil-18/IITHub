import React,{ useState ,useEffect} from 'react'
import './Styles/admin.css';
import { Button } from 'react-bootstrap';
import {ChatState} from '../context/chatProvider';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import axios from 'axios';
import {RxCross1} from 'react-icons/rx';
import {FaCheckCircle} from 'react-icons/fa';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {HiOutlinePencilSquare} from 'react-icons/hi2';
export default function AdminInterestGroup() {
  const {
    user,
  } = ChatState();
  const deleteMessage=async (id)=>{
    const config={
      headers:{
        "Authorization":`Bearer ${user.token}`,
      }
    }
    try {
      const {data} = await axios.delete(
        `http://localhost:5000/api/admin/${id}`,
        config
      );
      if (data) {
        alert ('Message deleted!!!');
      }
    } catch (error) {
    }
  }
  const [reqs,setReqs]=useState([])
  const getMessages=async ()=>{
    if(!user) return;
    const config={
      headers:{
        "Authorization":`Bearer ${user.token}`,
      }
    };
    try {
      const {data} = await axios.get(
        `http://localhost:5000/api/admin`,
        config
      );
      setReqs(data);
    } catch (error) {
    }
  }
  const [show,setShow]=useState('')
  const [interest,setInterest]=useState('')
  const [data,setData]=useState([])
  const addInterest=async ()=>{
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const {data}=await axios.post('http://localhost:5000/api/chat/group',{name:interest},config);
    } catch (error) {
      console.log(error)
    }
  }
  const renameInterest=async (id)=>{
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const {data}=await axios.put('http://localhost:5000/api/chat/rename',{
        chatId:id,
        chatName:interest
      },config);
    } catch (error) {
    }
  }
  const deleteInterest=async (id)=>{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const data=await axios.delete(`http://localhost:5000/api/chat/delete/${id}`,config);
    } catch (error) {
      console.log(error)
    }
  }
  const getInterests =async ()=>{
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const {data}=await axios.get('http://localhost:5000/api/chat/group',config);
      return data;
    } catch (error) {
    }
  }
  useEffect(() => {
    getMessages()
  }, [user,deleteMessage])
  useEffect(() => {
    if(!user) return;
    getInterests().then((data)=>{
      setData(data);
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [user,addInterest,renameInterest,deleteInterest])
  const [renameData,setRenameData]=useState(null)
    return (
        <div className='adminInterest'>
          <div className="row">
            <div className="col-md-4 border-box">
              <h4>Requests</h4>
              {show &&<Modal centered show={show} onHide={()=>{setShow(null)} }>
              <Modal.Header>
                <Modal.Title>ReConfirm: Add New Interest</Modal.Title>
                <CloseButton onClick={()=>{setShow(null)}} />
              </Modal.Header>
              <Modal.Body>
                <p>Interest Name:</p><input type="text" onChange={
                  (e)=>{
                    setInterest(e.target.value)
                  }
                } />
              </Modal.Body>
              <Modal.Footer>
                <button type="button" className="btn btn-primary" onClick={()=>{
                  addInterest()
                  setShow(null)
                }}>Add Interest</button>
              </Modal.Footer>
            </Modal>}
            {
              renameData &&<Modal centered show={renameData} onHide={()=>{setRenameData(null)} }>
              <Modal.Header>
                <Modal.Title>Renmae the Interest By</Modal.Title>
                <CloseButton onClick={()=>{setRenameData(null)}} />
              </Modal.Header>
              <Modal.Body>
                <p>New Interest Name:</p><input type="text" onChange={
                  (e)=>{
                    setInterest(e.target.value)
                  }
                } />
              </Modal.Body>
              <Modal.Footer>
                <button type="button" className="btn btn-primary" onClick={()=>{
                  renameInterest(renameData)
                  setRenameData(null)
                }
                }>Rename Interest</button>
              </Modal.Footer>
            </Modal>}
            {reqs.map((data,key)=>{
              {
                if(!data.interest) return null;
              }
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
                  <div>
                    <p style={{fontSize: '20px',  fontWeight: 'bold', marginBottom: '10px',}}>{"Interest : "+data.interest}</p>
                    <p style={{fontSize: '14px', color: '#555',}}>{data.reason}</p>
                  </div>
                  <div style={{float:'right'}}>
                    <Button variant="primary" style={{marginRight:'10px'}}onClick={()=>{
                      setShow(true)
                    }}>Add Interest</Button>
                    <CloseButton  onClick={()=>{
                      deleteMessage(data._id)
                    }} />
                  </div>
                </div>
              )
            })}
            </div>
            <div className="col-md-4 border-box">
              <Button variant="primary" style={{float:'right'}} onClick={()=>{setShow(true)}}>Add Interest</Button>
              <h4 style={{marginBottom:'1rem'}}>Add/Rename/Delete Interest Groups</h4>
              {data.map((data,key)=>{
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
                    <div>
                      <p style={{fontSize: '20px',  fontWeight: 'bold', marginBottom: '10px',}}>{"Interest : "+data.chatName}</p>
                    </div>
                    <div>
                      <HiOutlinePencilSquare size={20} color='green' style={{cursor:"pointer"}} onClick={()=>{
                        setRenameData(data._id)
                      }}/>
                      <RiDeleteBin6Line size={20} color='red' style={{cursor:"pointer"}} onClick={()=>{
                        deleteInterest(data._id)
                      }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
    )
}
