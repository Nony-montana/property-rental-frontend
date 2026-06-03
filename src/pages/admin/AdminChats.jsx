 import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaSearch, FaChevronDown, FaChevronUp, } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminChats = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedChat, setExpandedChat] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get('/admin/chats');
        setChats(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    navigate('/');
    return null;
  }

  const handleExpandChat = async (chatId) => {
    if (expandedChat === chatId) {
      setExpandedChat(null);
      return;
    }
    setExpandedChat(chatId);
    if (!messages[chatId]) {
      try {
        const res = await API.get(`/chats/${chatId}/messages`);
        setMessages((prev) => ({ ...prev, [chatId]: res.data.data }));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const filtered = chats.filter((c) =>
    c.property?.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.landlord?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    c.tenant?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />

      <div style={{ marginLeft: '240px', flex: 1, padding: '30px', backgroundColor: 'var(--light)', minHeight: '100vh' }}>

        {/* HEADER */}
        <div className="mb-4">
          <h3 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>All Conversations</h3>
          <p style={{ color: 'var(--text-light)' }}>{chats.length} conversations total</p>
        </div>

        {/* SEARCH */}
        <div className="card p-3 shadow-sm mb-4" style={{ borderRadius: '12px', border: 'none' }}>
          <div className="d-flex align-items-center gap-2">
            <FaSearch color="var(--text-light)" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by property, landlord or tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </div>
        </div>

        {loading && (
          <div className="text-center mt-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
          </div>
        )}

        {/* CHATS LIST */}
        <div className="d-flex flex-column gap-3">
          {filtered.map((chat) => (
            <div
              key={chat._id}
              className="card shadow-sm"
              style={{ borderRadius: '12px', border: 'none', overflow: 'hidden' }}>

              {/* CHAT HEADER */}
              <div
                className="p-3 d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer', backgroundColor: 'var(--white)' }}
                onClick={() => handleExpandChat(chat._id)}>

                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    backgroundColor: 'var(--primary)',
                    borderRadius: '8px',
                    padding: '10px',
                  }}>
                    <FaComments color="#F5A623" size={18} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.95rem' }}>
                      {chat.property?.title || 'Unknown Property'}
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.8rem' }}>
                      🏠 {chat.landlord?.firstName} {chat.landlord?.lastName}
                      &nbsp;↔&nbsp;
                      👤 {chat.tenant?.firstName} {chat.tenant?.lastName}
                    </p>
                    {chat.lastMessage && (
                      <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.78rem', fontStyle: 'italic' }}>
                        Last: {chat.lastMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                    {new Date(chat.lastMessageTime).toLocaleDateString()}
                  </span>
                  {expandedChat === chat._id
                    ? <FaChevronUp color="var(--text-light)" />
                    : <FaChevronDown color="var(--text-light)" />
                  }
                </div>
              </div>

              {/* MESSAGES */}
              {expandedChat === chat._id && (
                <div style={{
                  backgroundColor: 'var(--light)',
                  padding: '16px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  borderTop: '1px solid #eee'
                }}>
                  {!messages[chat._id] ? (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)' }}></div>
                    </div>
                  ) : messages[chat._id].length === 0 ? (
                    <p style={{ color: 'var(--text-light)', textAlign: 'center', fontSize: '0.9rem' }}>
                      No messages yet
                    </p>
                  ) : (
                    messages[chat._id].map((msg) => (
                      <div
                        key={msg._id}
                        className="mb-2 p-2"
                        style={{
                          backgroundColor: 'var(--white)',
                          borderRadius: '8px',
                          borderLeft: `3px solid ${msg.sender?.role === 'LANDLORD' ? 'var(--accent)' : 'var(--primary)'}`
                        }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                          {msg.sender?.firstName} {msg.sender?.lastName}
                          <span style={{ color: 'var(--text-light)', fontWeight: 'normal', marginLeft: '8px' }}>
                            ({msg.sender?.role})
                          </span>
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#333' }}>
                          {msg.content}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center mt-5">
            <FaComments size={50} color="#F5A623" />
            <h5 className="mt-3" style={{ color: 'var(--text-light)' }}>No conversations found</h5>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminChats;
