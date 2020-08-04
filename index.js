if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server);
const path = require('path');
const mongoose = require('mongoose');
const UserController = require('./server/controllers/UserController');
const FileUploadController = require('./server/controllers/FileUploadController');
const RoomController = require('./server/controllers/RoomController');
const signUpMiddleware = require('./server/middlewares/SignupMiddleware');
const loginMiddleWare = require('./server/middlewares/LoginMiddleware');
const bodyParser = require('body-parser');
const Helpers = require('./server/helpers/Helpers');



app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/server/images", express.static(path.join(__dirname, '/server/images')));







app.post('/upload', FileUploadController.fileUpload);

app.post('/signup', signUpMiddleware, UserController.signUp);
app.post('/login', loginMiddleWare, UserController.logIn);


io.on('connection', (socket) => {

  const messageData = new Date();

  socket.on("newUser", async (token) => {

    //Getting token
    const verifyToken = await Helpers.verifyToken(token);
    if(!token || !verifyToken) return socket.emit('tokenError');

    //Getting logged User Data
    const loggedUserData = await UserController.getUserInfo(token);
    if(!loggedUserData) return false;

    //Joining the Guest Room
    const guestRoomID = process.env.GUEST_ROOM_ID;
    const joinGuestRoom = await RoomController.joinRoom(token, guestRoomID);
    if(!joinGuestRoom) return false;

    //GetRoom List
    const roomsList = await RoomController.getRooms();
    if(!roomsList) return false;

    //Get RoomUsersList
    const guestRoomId = roomsList.rooms[0]._id;
    const roomUsers = await UserController.getRoomUsersData(guestRoomId);
    if (!roomUsers) return false;


    const firstRoomId = roomsList.rooms[0]._id;

    socket.join(firstRoomId);

    const userFullName = loggedUserData.fullName;
    
    const joinObj = {
      type: 'system',
      sender: 'System',
      message: 'Welcome ' + userFullName + '!',
      roomsList: roomsList,
      currentUser: loggedUserData,
      attachment: null,
      roomUsers,
      date: messageData.getHours() + ":" + messageData.getMinutes(),
    }
    if(roomsList.rooms.length > 0) {
      joinObj.currentRoom = roomsList.rooms[0];
    }
    socket.emit('joinCompleted', joinObj);

    socket.to(firstRoomId).emit('newUserArrived', {
      type:'system',
      sender: 'System',
      roomsList: roomsList,
      message: userFullName + ' has arrived!',
      attachment: null,
      roomUsers,
      date: messageData.getHours() + ":" + messageData.getMinutes(),
    });

  })
  

  socket.on('getUserInfo', (userID) => {
    const temporaryData = {
      id: userID,
      fullName: 'John doe',
      email: 'email@gmail.com',
      status: 'User',
      avatar: null,
    };

    socket.emit('userInfoProvided', temporaryData);
  })

  socket.on('roomHandler', async (data) => {
    const {token, room, action, defaultRoom = null} = data;

    const verifyToken = await Helpers.verifyToken(token);

    if(!token || !verifyToken) return socket.emit('tokenError');

    if(action === "create"){
      const roomCreated = await RoomController.createRoom(room);
      if(!roomCreated){
        socket.emit('RoomCreateError');
      }
      else{
        io.emit('roomCreated', roomCreated.savedRoom);
      }
      
    }
    else if(action === "update"){
      const roomUpdated = await RoomController.updateRoom(room);

      if(!roomUpdated){
        socket.emit('roomUpdateError');
      }
      else{
        io.emit('roomUpdated', roomUpdated)
      }
    }
    else{
      const roomRemoved = await RoomController.removeRoom(room._id);
      if(!roomRemoved){
        socket.emit('roomRemoveError');
      }
      else{
        io.of('/').in(room._id).clients((error, socketIds) => {
          if (error) throw error;

          socketIds.forEach(socketId => {
            io.sockets.sockets[socketId].leave(room._id);
            io.sockets.sockets[socketId].join(defaultRoom._id);
            io.sockets.sockets[socketId].emit('room-changed', {
              room: defaultRoom,
              message: {
                type: 'system',
                sender: 'System',
                message: 'Previous room was deleted, and you has been redirected to Guest Room by default!',
                attachment: null,
                date: messageData.getHours() + ":" + messageData.getMinutes(),
              }
            })
          });

        });

        io.emit('roomDeleted', room);
      }
    }
  });

  

  socket.on('newMsg', async (token, data) => {

    const verifiedToken = await Helpers.verifyToken(token);
    if (!verifiedToken) return socket.emit('tokenError');

    const userData = await Helpers.decodeToken(token);

    const userID = userData.sub;

    const {msg, room, user, avatar} = data;

    socket.emit('newMsgSaved', {
      type: 'current',
      sender: user,
      message: msg.text,
      user: userID,
      attachment: msg.attachment ?? null,
      date: messageData.getHours() + ":" + messageData.getMinutes(),
    });

    socket.to(room._id).emit('newMsgSaved', {
      type: 'everyone',
      sender: user,
      user: userID,
      message: msg.text,
      attachment: msg.attachment ?? null,
      date: messageData.getHours() + ":" + messageData.getMinutes(),
    });

  });


  socket.on('roomAuthMiddleware', async (token, {passRoom, author, currentRoom, roomPassword}) => {

    const verifiedToken = await Helpers.verifyToken(token);
    if(!verifiedToken) return socket.emit('tokenError');
    const verifiedPassword = await RoomController.verifyPassword(passRoom, roomPassword);
    if(verifiedPassword)
    {
      roomHandler(currentRoom, passRoom, token, author);
    }
    else
    {
      socket.emit('wrongPass');
    }
    
  });

  socket.on('change-room', async (token, oldRoom, newRoom, fullName) => {
    const verifyToken = await Helpers.verifyToken(token);
    if(!token || !verifyToken) return socket.emit('tokenError');
    roomHandler(oldRoom, newRoom, token, fullName);
  })

  const roomHandler = async (oldRoom, newRoom, token, fullName) => {

    const userExited = await RoomController.exitRoom(token, oldRoom._id);
    if(!userExited) return false;

    socket.to(oldRoom._id).emit('userGone', { exitedUserID: userExited.exitedUser });

    const oldRoomUsers = await UserController.getRoomUsersData(oldRoom._id);
    if (!oldRoomUsers) return false;

    socket.to(oldRoom._id).emit('user-left-room', {
      message: {
        type: 'system',
        sender: 'System',
        message: fullName + ' has left the room!',
        attachment: null,
        date: messageData.getHours() + ":" + messageData.getMinutes(),
      },
      roomUsers: oldRoomUsers
      
    });

    socket.leave(oldRoom._id);

    const joinNewRoom = await RoomController.joinRoom(token, newRoom._id);
    
    if(!joinNewRoom) return false;
    
    const newRoomUsers = await UserController.getRoomUsersData(newRoom._id);
    if (!newRoomUsers) return false;


    socket.join(newRoom._id);
    socket.emit('room-changed', {
      room: newRoom,
      roomUsers: newRoomUsers,
      message: {
        type: 'system',
        sender: 'System',
        message: 'Room has been changed!',
        attachment: null,
        date: messageData.getHours() + ":" + messageData.getMinutes(),
      }
    });


    socket.to(newRoom._id).emit('room-changed-rest', {
      room: newRoom,
      roomUsers: newRoomUsers,
      message: {
        type: 'system',
        sender: 'System',
        message: fullName + ' has arrived!',
        attachment: null,
        date: messageData.getHours() + ":" + messageData.getMinutes(),
      }
    });


  }

  socket.on('userExited', async (data) => {
    const {token, room, fullName} = data;
    const userExited = await RoomController.exitRoom(token, room);

    if(!userExited) return false;

    const roomUsers = await UserController.getRoomUsersData(room);
    if (!roomUsers) return false;

    socket.to(room).emit('userLeft', {
      currentRoomUsers: roomUsers,
      message: {
        type: 'system',
        sender: 'System',
        message: fullName + ' has left the chat!',
        attachment: null,
        date: messageData.getHours() + ":" + messageData.getMinutes(),
      }
    });

  })

  // socket.on('browserClosing', async (data) => {
  //   const {room, token} = data;
  //   RoomController.exitRoom(token, room);
  // });

  socket.on('updateUserData', async (data) => {
    const {token, fullName, email, avatar} = data;
    const verifyToken = await Helpers.verifyToken(token);
    if(!token || !verifyToken) return socket.emit('tokenError');
    
    const userUpdated = await UserController.updateUserInfo(data);

    if(!userUpdated) return false;

    socket.emit('userUpdateSuccess', userUpdated);
    socket.broadcast.emit('roomUserUpdated', userUpdated);
  })

  socket.on('banUser', async (user, room) => {
    const userBanned = await UserController.banUser(user);
    if(userBanned.message){
      return socket.emit('banError', userBanned.message);
    }

    const removeUserFromRoom = await RoomController.removeUserFromRoom(user, room);

    if(!removeUserFromRoom) socket.emit('banError', 'Some error ocurred, Please try again later'); 

    const {exitedUser} = removeUserFromRoom;

    const roomUsers = await UserController.getRoomUsersData(room);
    if (!roomUsers) return false;

    socket.emit('userBanCompleted', {
      userID: exitedUser,
      currentRoomUsers: roomUsers
    });
    socket.broadcast.emit('userBanCompleted', {
      userID: exitedUser,
      currentRoomUsers: roomUsers
    });

  });

  // socket.broadcast.emit('userExit', {
  //   type: 'system',
  //   sender: 'System',
  //   message: 'Elman has left the chat',
  //   date: messageData.getHours() + ":" + messageData.getMinutes(),
  // });

  socket.on("disconnect", () => {

  });

});

const port = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production'){
   app.use(express.static('client/build'));
   app.get('*', (req, res) => {
     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
   })
}

mongoose.connect(process.env.DB_URL,  
{
  useNewUrlParser: true, 
  useUnifiedTopology:true,
  useCreateIndex: true
})
.then(res => {
  server.listen(port);
});
