import React, { useState, useEffect } from 'react';
import './../../css/Doctor/container.css'
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
const dummyData = [
  { message: 'Hello there!', senderName: 'John Doe' },
  { message: 'Haddi kaate bina kaam kaise chalau?', senderName: 'Nitish Kumar' },
  {message: 'Kaveri bahut mehenga hai ',senderName: 'Nitish Kumar'}
];

const yourName = 'Your Name'; // Replace with your actual name

function Chats() {
  const [messages, setMessages] = useState(dummyData);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simulate loading messages from an API (replace with actual API calls)
    setTimeout(() => {
      // setMessages([...messages, ...dummyData]); // uncomment if you want to append dummy data
    }, 1000);
  }, []);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (newMessage.trim() === '') {
      alert('Please enter a message.');
      return;
    }

    setMessages([...messages, { message: newMessage, senderName: yourName }]);
    setNewMessage(''); // Clear message input
  };

  return (
    <div>
         <Navbar />
     <SideNavbar />
    <div className="chats-container" style={{marginLeft: '250px', marginTop: '56px' ,marginBottom:'500px'}}>
   
      <h1>Chats</h1>
      <ul className="messages-list">
        {messages.map((message, index) => (
          <li key={index}>
            {message.senderName === yourName ? (
              <strong>You: </strong>
            ) : (
              <strong>{message.senderName}: </strong>
            )}
            <span className="message-text">{message.message}</span>
          </li>
        ))}
      </ul>
      <form className="message-form" onSubmit={handleSendMessage} style={{marginLeft:'250px'}}>
        <input
          type="text"
          name="message"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
    </div>
  );
}

export default Chats;
