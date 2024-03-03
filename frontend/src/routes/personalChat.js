import React from 'react'
import Header from './../Components/Header.js';
import Friends from  './../Components/Friends.js';
import ChatPage from './../Components/chatPage.js';
import '../Components/Styles/personalChat.css';
import { ChatState } from '../context/chatProvider';
function personalChat() {
  const {
    selectedChat
  }=ChatState();
  return (
    <div>
      <Header/>
      <div className="divide">
        <div className={!selectedChat? "left":"hide1"} ><Friends/></div>
        <div className={selectedChat ? "right" : "hide2"}><ChatPage/></div>
      </div>
    </div>
  )
}
export default personalChat;
