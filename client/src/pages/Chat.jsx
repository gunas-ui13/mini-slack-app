import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io.connect("http://localhost:5000");

export default function Chat() {
  const navigate = useNavigate();
  const scrollRef = useRef(); // 1. Ref for auto-scrolling

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [activeChannel, setActiveChannel] = useState("General");
  const [onlineUsers, setOnlineUsers] = useState([]); 
  const [channels, setChannels] = useState([]); 

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      socket.emit("add_user", userId);
    }
  }, [userId, navigate]);

  useEffect(() => {
    socket.on("get_users", (users) => {
      setOnlineUsers(users);
    });
  }, [socket]);

  useEffect(() => {
    socket.off("receive_message").on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/channels");
        setChannels(res.data);
      } catch (err) {
        console.error("Error fetching channels:", err);
      }
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    socket.emit("join_channel", activeChannel);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${activeChannel}`);
        const formattedMessages = res.data.map(msg => ({
          channel: msg.channel,
          author: msg.sender,
          message: msg.content,
          time: msg.timestamp
        }));
        setMessageList(formattedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [activeChannel]);

  // 2. AUTO-SCROLL EFFECT
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const createChannel = async () => {
    const channelName = prompt("Enter new channel name:");
    if (channelName) {
      try {
        const res = await axios.post("http://localhost:5000/api/channels", {
          name: channelName,
        });
        setChannels([...channels, res.data]); 
      } catch (err) {
        alert("Error creating channel");
      }
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        channel: activeChannel,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  return (
    <div className="chat-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>🚀 Mini Slack</h3>
        
        {/* CHANNELS SECTION */}
        <div className="section-header">
          <h4>Channels</h4>
          <button onClick={createChannel} className="add-btn">+</button>
        </div>
        
        <ul className="channel-list">
          <li 
             className={`channel-item ${activeChannel === "General" ? "active" : ""}`}
             onClick={() => setActiveChannel("General")}
          ># General</li>

          {channels.map((channel) => (
            <li
              key={channel._id}
              className={`channel-item ${activeChannel === channel.name ? "active" : ""}`}
              onClick={() => setActiveChannel(channel.name)}
            >
              # {channel.name}
            </li>
          ))}
        </ul>

        {/* ONLINE USERS SECTION */}
        <div className="section-header">
          <h4>🟢 Online ({onlineUsers.length})</h4>
        </div>
        <ul className="channel-list">
             <li className="channel-item" style={{cursor: "default"}}>
               👥 {onlineUsers.length} active users
             </li>
        </ul>

        {/* LOGOUT */}
        <div className="logout-btn" onClick={() => {
            localStorage.clear();
            navigate("/login");
            window.location.reload(); 
        }}>
          Logout ({username})
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="chat-area">
        <div className="chat-header">
          # {activeChannel}
        </div>

        <div className="messages-box">
          {messageList.map((msg, index) => {
            return (
              <div 
                key={index} 
                className={`message ${username === msg.author ? "mine" : ""}`}
              >
                <span className="message-meta">{msg.author} • {msg.time}</span>
                <div className="message-content">
                  <p>{msg.message}</p>
                </div>
              </div>
            );
          })}
          {/* Invisible div to scroll to */}
          <div ref={scrollRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={currentMessage}
            placeholder={`Message #${activeChannel}`}
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}