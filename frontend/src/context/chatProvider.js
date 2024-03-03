import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();
  const navigate=useNavigate();
  const [wantLogin,setWantLogin]=useState(true);
  useEffect(() => {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      setUser(userInfo);
      if (!userInfo) {
        if(window.location.href==='http://localhost:3000/'){
          /* DO Nothing */
        }
        else if(window.location.href==='http://localhost:3000/signup'){
          setWantLogin(false);
          navigate("/signup")
        }
        else if(wantLogin){
          navigate("/login");
        }
        else{
          navigate("/signup");
        }
      }
    }, [wantLogin]);
    return (
    <ChatContext.Provider
      value={{
        wantLogin,
        setWantLogin,
        selectedChat,
        setSelectedChat,
        selectedGroup,
        setSelectedGroup,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;