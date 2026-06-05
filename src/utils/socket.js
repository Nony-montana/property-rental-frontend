import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'https://property-rental-backend-vnc5.onrender.com');

export default socket;