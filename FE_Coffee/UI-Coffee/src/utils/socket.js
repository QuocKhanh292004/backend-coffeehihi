import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BASE_URL.replace('/api', '');

const socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    transports: ['websocket'],
});

socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log(' Socket disconnected, reason:', reason);
});

socket.on('connect_error', (error) => {
    console.error('🔴 Socket connection error:', error.message);
});

export default socket;
