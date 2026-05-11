import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import socket from '../utils/socket';
import { FaPaperPlane } from 'react-icons/fa';

const ChatBox = ({ chat }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chats/${chat._id}/messages`);
        setMessages(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    // Mark messages as read
      API.put(`/chats/${chat._id}/mark-read`);

    fetchMessages();

    // Join the chat room
    socket.emit('join_chat', chat._id);

    // Listen for new messages — check for duplicates
    socket.on('receive_message', (data) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    return () => {
      socket.off('receive_message');
    };
  }, [chat._id]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await API.post(`/chats/${chat._id}/messages`, {
        content: newMessage,
      });

      // Emit to socket only — don't add to state directly
      socket.emit('send_message', {
        chatId: chat._id,
        ...res.data.data,
      });

      setNewMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) return (
    <div className="text-center p-4">
      <div className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)' }}></div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* CHAT HEADER */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--primary)',
        borderRadius: '8px 8px 0 0',
        color: 'var(--white)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem' }}>
          {chat.property?.title}
        </p>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
          {user.role === 'LANDLORD'
            ? `${chat.tenant?.firstName} ${chat.tenant?.lastName}`
            : `${chat.landlord?.firstName} ${chat.landlord?.lastName}`
          }
        </p>
      </div>

      {/* MESSAGES */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: 'var(--light)',
        minHeight: '300px',
        maxHeight: '400px',
      }}>
        {messages.length === 0 && (
          <div className="text-center mt-4">
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              No messages yet — say hello! 👋
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender._id === user.id;
          return (
            <div
              key={msg._id}
              style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}>
              <div style={{
                maxWidth: '70%',
                padding: '8px 12px',
                borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                backgroundColor: isMe ? 'var(--primary)' : 'var(--white)',
                color: isMe ? 'var(--white)' : 'var(--primary)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.content}</p>
                <p style={{
                  margin: 0,
                  fontSize: '0.7rem',
                  opacity: 0.7,
                  textAlign: 'right',
                  marginTop: '4px'
                }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{
        padding: '12px',
        backgroundColor: 'var(--white)',
        borderRadius: '0 0 8px 8px',
        borderTop: '1px solid var(--light)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ borderRadius: '20px', fontSize: '0.9rem' }}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: 'var(--primary)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}>
          <FaPaperPlane color="white" size={16} />
        </button>
      </div>

    </div>
  );
};

export default ChatBox;