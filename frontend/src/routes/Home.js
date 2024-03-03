import React, { useEffect } from 'react'
import Header from './../Components/Header.js';
import SideBar from './../Components/sideBar.js';
import GroupChatPage from './../Components/groupChatPage.js';
import { ChatState } from '../context/chatProvider';
import '../Components/Styles/home.css';
import { useState } from 'react';
function Home() {
  const {
    selectedGroup,
  } = ChatState();
  useEffect(() => {
    if (!sessionStorage.getItem('hasReloaded')) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }, []);
  return (
    <div>
      <Header />
      <div className="divide">
        <div className={!selectedGroup ? "left1" : 'hide1'}><SideBar /></div>
        <div className={selectedGroup ? 'right1' : 'hide2'}><GroupChatPage /></div>
      </div>
    </div>
  )
}
export default Home