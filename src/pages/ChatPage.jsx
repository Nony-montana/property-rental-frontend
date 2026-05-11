 import React, { useState } from 'react';
 import ChatList from '../components/ChatList';
 import ChatBox from '../components/ChatBox';
 import { FaComment } from 'react-icons/fa';
 
 const ChatPage = () => {
   const [selectedChat, setSelectedChat] = useState(null);
 
   return (
     <div>
       <h4 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
         My Conversations
       </h4>
 
       <div className="row">
 
         {/* LEFT — CHAT LIST */}
         <div className="col-md-4">
           <div className="card shadow-sm" style={{ borderRadius: '12px', border: 'none', overflow: 'hidden' }}>
             <div style={{
               padding: '12px 16px',
               backgroundColor: 'var(--primary)',
               color: 'var(--white)',
               fontWeight: 'bold'
             }}>
               Conversations
             </div>
             <ChatList
               onSelectChat={setSelectedChat}
               selectedChatId={selectedChat?._id}
             />
           </div>
         </div>
 
         {/* RIGHT — CHAT BOX */}
         <div className="col-md-8">
           {selectedChat ? (
             <div className="card shadow-sm" style={{ borderRadius: '12px', border: 'none', overflow: 'hidden' }}>
               <ChatBox chat={selectedChat} />
             </div>
           ) : (
             <div
               className="card shadow-sm d-flex align-items-center justify-content-center"
               style={{
                 borderRadius: '12px',
                 border: 'none',
                 height: '400px',
                 backgroundColor: 'var(--white)'
               }}>
               <div className="text-center">
                 <FaComment size={50} color="#F5A623" />
                 <h5 className="mt-3" style={{ color: 'var(--primary)' }}>
                   Select a conversation
                 </h5>
                 <p style={{ color: 'var(--text-light)' }}>
                   Choose a chat from the left to start messaging
                 </p>
               </div>
             </div>
           )}
         </div>
 
       </div>
     </div>
   );
 };
 
 export default ChatPage;
