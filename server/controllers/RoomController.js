const Room = require('../models/Room');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const getRooms = async () => {
    
    try {
        const rooms = await Room.find({}, {
            id: 1,
            name: 1,
            topic: 1,
            protected: 1,
            users: 1,
        });
        return {
            message: 'Room has been retrieved',
            rooms
        }

    } catch (err) {
        return {
            message: err
        }
    }
}


const createRoom = async (room) => {
    const { name, topic, password } = room;
    let hashedPass = null;
    if (password) {
        hashedPass = await bcrypt.hash(password, 10);
        if (!hashedPass) {
            return {
                message: err
            }
        }
    }


    let initialRoom = {
        _id: new mongoose.Types.ObjectId(),
        name,
        topic,
    }

    if (password) {
        initialRoom.password = hashedPass;
        initialRoom.protected = true;
    }

    //Generating new collection
    const newRoom = new Room(initialRoom);

    //Saving user to database
    try {
        const savedRoom = await newRoom.save();
        return {
            message: 'User has been created',
            savedRoom
        }

    } catch (err) {
        return {
            message: err
        }
    }
}

const removeRoom = async (room) => {
    const roomDeleted = await Room.deleteOne({_id: room}).exec();

    if(!roomDeleted) return false;

    return true;
}

const updateRoom = async (room) => {

    const {_id, name, topic, password} = room;
    const roomExist = await Room.findById({_id});

    if(!roomExist) return false;

    roomExist.name = name;
    roomExist.topic = topic;
    if(password){
        let hashedPass = null;
        if (password) {
            hashedPass = await bcrypt.hash(password, 10);
            if (!hashedPass) {
                return {
                    message: err
                }
            }
        }
        roomExist.protected = true;
        roomExist.password = hashedPass;
    }

    const roomUpdated = await roomExist.save();

    if(!roomUpdated) return false;

    return roomUpdated;
}

const verifyPassword = async (currentRoom, passRoom) => {

    const {_id} = currentRoom;
    const roomExist = await Room.findById({_id});
    
    if(!roomExist) return false;

    const roomPass = roomExist.password;

    const passwordTrue = await bcrypt.compare(passRoom, roomPass);

    if(!passwordTrue) return false;

    return true;
}

const getRoomUsers = async (_id) => {
    const guestRoom = await Room.findById({_id})
    if(!guestRoom) return false;
    return guestRoom.users;
}

const joinRoom = async (token, _id) => {

    const decodeToken = await jwt.decode(token);
    if(!decodeToken) return false;
    let userID = decodeToken.sub;
    const guestRoom = await Room.findById({_id})

    if(!guestRoom) return false;

    const roomUsers = guestRoom.users;
    const userInRoomIndex = roomUsers.findIndex(x => x.id === userID);
    if(userInRoomIndex > -1) return true;
    userID = userID.trim();
    roomUsers.push({id: userID});
    guestRoom.users = roomUsers;
    const joinCompleted = await guestRoom.save();

    if(!joinCompleted) return false;

    return true;

    
}

const exitRoom = async (token, room) => {
    const loggedRoom = await Room.findById({_id:room});
    if(!loggedRoom) return false;
    const decodeToken = await jwt.decode(token);
    if(!decodeToken) return false;
    const userID = decodeToken.sub;
    const roomUsers = loggedRoom.users;
    if(!roomUsers || roomUsers.length === 0) return userID;


    try {
        const arrayIndex = roomUsers.findIndex(x => x.id === userID);
        if (arrayIndex > -1) {
            roomUsers.splice(arrayIndex, 1);
            loggedRoom.users = roomUsers;
            const roomDataUpdated = await loggedRoom.save();
            return {
                exitedUser: userID,
                currentRoomUsers: roomDataUpdated.users
            };
        }
    } catch (error) {
        return {exitedUser: userID, currentRoomUsers: []};
    }

    
    

    
}


const removeUserFromRoom = async (userID, room) => {
    const loggedRoom = await Room.findById({_id:room})
    if(!loggedRoom) return false;
    const roomUsers = loggedRoom.users;
    if(!roomUsers || roomUsers.length === 0) return userID;


    const arrayIndex = roomUsers.findIndex(x => x.id === userID);
    if(arrayIndex > -1){
        roomUsers.splice(arrayIndex, 1);
        loggedRoom.users = roomUsers;
        const roomDataUpdated = await loggedRoom.save();
        return {
            exitedUser: userID,
            currentRoomUsers: roomDataUpdated.users
        };
    }

    return {exitedUser: userID}
    

    
}


module.exports = {
    createRoom,
    getRooms,
    getRoomUsers,
    updateRoom,
    removeRoom,
    verifyPassword,
    joinRoom,
    exitRoom,
    removeUserFromRoom
};