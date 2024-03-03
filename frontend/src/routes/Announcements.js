import React, { useState } from 'react';
import Header from './../Components/Header.js';
import Nav from 'react-bootstrap/Nav';
import { ChatState } from '../context/chatProvider.js';
import AllAnnouncements from './../Components/allAnnouncements.js';
import Followed from './../Components/Followed.js';
import Following from './../Components/Following.js';
function Announcement () {
  const [activeKey, setActiveKey] = useState('Personal Feed');
  const {
    user
  }=ChatState();
  return (
    <div >
      <Header />
      <div style={{ display: 'flex' }}>
      <Nav className="flex-column" style={{ width: '200px', marginTop: '10px' }} variant="pills" activeKey={activeKey} onSelect={setActiveKey}>
        <Nav.Item>
          <Nav.Link eventKey="all">All</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Personal Feed">Your Feed</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="following">Following</Nav.Link>
        </Nav.Item>
      </Nav>
          <div style={{ flex: 1, padding: '10px' }}>
            {activeKey === 'all' && <AllAnnouncements />}
            {activeKey === 'Personal Feed' && <Followed />}
            {activeKey === 'following' && <Following />}
          </div>
      </div>
    </div>
  );
}

export default Announcement;