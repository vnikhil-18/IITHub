import {ChatState} from '../context/chatProvider';
import React from 'react';
import {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer, toast} from 'react-toastify';
import {FaSearch} from 'react-icons/fa';
import Offcanvas from 'react-bootstrap/Offcanvas';
import BranchSelect from './BranchSelect';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function SideDrawer(props) {
    const [searchData, setSearchData] = React.useState ([]);
    const ref = useRef (null);
    const [search, setSearch] = React.useState ('');
    const [show, setShow] = useState (false);
    const handleClose = () =>{
        setShow(false);
        props.setShow(false);
    }
    const [branch, setBranch] = useState ('');
    const handleShow = () => setShow (true);
    const navigate = useNavigate ();
    const {
      selectedChat,
      setSelectedChat,
      user,
      notification,
      setNotification,
      chats,
      setChats,
    } = ChatState ();
    const searchInDB = async () => {
      if (!search) {
        toast ('Enter name!!!');
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.get (
          `http://localhost:5000/api/user?search=${search}`,
          config
        );
        setSearchData (data);
        console.log (searchData);
        if (data.length === 0) {
          toast ('No user found!!!');
        }
      } catch (error) {
        console.log (error);
        toast ('Error in searching!!!');
      }
    };
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
        handleClose ();
      } catch (error) {
        console.log (error);
        toast ('Error in accessing chat!!!');
      }
    };
  return (
    <div>
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
      {/* {console.log(show)} */}
      <Offcanvas show={props.show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul style={{listStyle: 'none'}}>
            <li>
              <div>
                <input
                  type="text"
                  onChange={e => {
                    setSearch (e.target.value);
                  }}
                />
                <FaSearch
                  size="1.5rem"
                  style={{marginLeft: '20px'}}
                  onClick={searchInDB}
                />
              </div>
            </li>
            {searchData.map ((val, key) => {
              console.log (val);
              return (
                <li
                  key={key}
                  className="row"
                  style={{
                    marginBottom: '0.5rem',
                    margin: '0',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    // {console.log(val._id);}
                    accessChat (val._id);
                  }}
                >
                <Card width="100%">
                  <Row>
                    <Col>
                      <Card.Body>
                        <Card.Title>{val.name}</Card.Title>
                        <Card.Text>
                          {val.email}
                        </Card.Text>
                      </Card.Body>
                    </Col>
                    <Col style={{right: '0'}}>
                      <Card.Img
                        variant="top"
                        style={{width: '5rem', float: 'right'}}
                        src={val.pic}/>
                    </Col>
                  </Row>
                </Card>
              </li>
            )})}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default SideDrawer
