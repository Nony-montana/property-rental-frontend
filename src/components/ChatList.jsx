import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { FaComment } from 'react-icons/fa';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get('/chats/my-chats');
        setChats(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) return (
    <div className="text-center p-3">
      <div className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)' }}></div>
    </div>
  );

  if (chats.length === 0) return (
    <div className="text-center p-4">
      <FaComment size={30} color="#F5A623" />
      <p className="mt-2" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
        No conversations yet
      </p>
    </div>
  );

  return (
    <div>
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onSelectChat(chat)}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--light)',
            backgroundColor: selectedChatId === chat._id ? 'var(--light)' : 'var(--white)',
            transition: 'background 0.2s'
          }}>

          {/* PROPERTY IMAGE & INFO */}
          <div className="d-flex align-items-center gap-3">
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'var(--primary)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {chat.property?.images?.length > 0 ? (
                <img
                  src={chat.property.images[0]}
                  alt="property"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <FaComment color="#F5A623" size={16} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontWeight: 'bold',
                color: 'var(--primary)',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {chat.property?.title}
              </p>
              <p style={{
                margin: 0,
                fontSize: '0.8rem',
                color: 'var(--text-light)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user.role === 'LANDLORD'
                  ? `${chat.tenant?.firstName} ${chat.tenant?.lastName}`
                  : `${chat.landlord?.firstName} ${chat.landlord?.lastName}`
                }
              </p>
              {chat.lastMessage && (
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: 'var(--text-light)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {chat.lastMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;