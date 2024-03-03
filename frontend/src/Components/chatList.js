import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

function ChatList({ chats }) {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="chatList">
      {chats.map((chat, index) => (
        <Card
          key={index}
          className="chatListCard"
          onClick={() => setSelectedChat(chat)}
        >
          <Card.Body>
            <Card.Title>{chat.name}</Card.Title>
            <Card.Text>{chat.lastMessage}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
export default ChatList;