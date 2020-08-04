import io from "socket.io-client";
const socket = io(process.env.REACT_APP_BACKEND_URL, {'sync disconnect on unload': true });
export default socket;