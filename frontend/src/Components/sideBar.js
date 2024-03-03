import React, { useState, useEffect } from 'react'
import './Styles/sideBar.css'
import { FaPlus } from 'react-icons/fa'
import { VscRequestChanges } from 'react-icons/vsc'
import { IoChatbubblesSharp } from 'react-icons/io5'
import axios from 'axios'
import { ChatState } from '../context/chatProvider'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
function SideBar() {
  const navigate = useNavigate();
  const {
    user,
    selectedGroup,
    setSelectedGroup,
  } = ChatState();
  const [Interest, setInterest] = useState(false);
  const [data, setData] = useState([]);
  const [groupChatName, setGroupChatName] = useState("hello");
  const [newGroup, setNewGroup] = useState();
  const getData = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.get('http://localhost:5000/api/chat/group', config);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
  const addGroup = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    //without admin
    // try {
    //   const {data}=await axios.post('http://localhost:5000/api/chat/group',{name:newGroup},config);
    // } catch (error) {
    //   console.log(error.message);
    // }
    try {
      const { data } = await axios.post('http://localhost:5000/api/admin', {
        reqUser: user,
        interest: newGroup,
      }, config);
      if (data) {
        toast.success("Request sent");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    if (!user) return;
    getData().then((data) => {
      setData(data);
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [addGroup])

  return (
    <div className='sidebar-fixed'>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} draggable theme="light" />
      <ul className='sideBarList'>
        <li className='yourchat'>
          <div className="row1" onClick={
            () => {
              navigate("/personalchat");
            }
          }>
            <IoChatbubblesSharp size={25} color='#343a40' style={{ margin: '5px' }} />
            Your Chats
          </div>
        </li>
        <li>
          <div className='row-split'>
            <div id='add' style={{ cursor: "pointer" }} onClick={() => {
              setInterest(!Interest);
              console.log(Interest);
            }}>
              <VscRequestChanges size={25} color='#343a40' style={{ margin: '5px' }} />
              Request interest
            </div>
          </div>
        </li>

        <li className={Interest ? "request" : "passive"}>
          <div className="request1">
            <div id="inp">
              <input type="text" className='Interest' onChange={
                (e) => {
                  setNewGroup(e.target.value);
                }
              }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addGroup();
                  }
                }}
              />
            </div>
            <div id="plus">
              <FaPlus size={15} color='white' onClick={() => {
                addGroup();
              }}
                style={{ cursor: "pointer" }} />
            </div>
          </div>
        </li>
        <hr className='ruler' />
        {
          data.map((val, key) => {
            return (
              <li key={key} className='row' style={{ backgroundColor: (selectedGroup && selectedGroup._id === val._id) ? '#e0e0e0' : '' }} onClick={() => {
                setGroupChatName(val.chatName);
                setSelectedGroup(val);
                console.log(selectedGroup);
              }}>
                <div>{val.chatName}</div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default SideBar