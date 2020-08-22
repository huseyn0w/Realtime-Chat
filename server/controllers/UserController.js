const User = require('../models/User');
const Rooms = require('../models/Room');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const RoomController = require('./RoomController');

const signUp = async (req, res) => {
  const {fullName, email, password} = req.body;
  
  //Check if that email already registered
  const user = await User.find({email:email}).exec();
  if(user.length >= 1){
    return res.status(409).json({message: 'Email has already been taken'})
  }

  //Hashing password
  const hashedPass = await bcrypt.hash(password, 10);
  if(!hashedPass){
    return res.status(500).json({
      message: err
    })
  }

  //Generating new collection
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    fullName,
    email,
    password: hashedPass
  });

  //Saving user to database
  try {
    const savedUser = await newUser.save();
    return res.status(201).json({
      message: 'User has been created'
    })
    
  } catch (err) {
    return res.status(500).json({
      message: err
    })
  }
 
};




const logIn = async (req, res) => {

  const {email, password} = req.body;

  const userExist = await User.find({email}).exec();

  if(userExist.length === 0 || !userExist) return res.status(404).json({message: 'Auth failed'});

  if(userExist[0].banned) return res.status(404).json({message: 'Unfortunately you are banned and can not join the chat, please contact administrator for help'});

  const truePassword = await bcrypt.compare(password, userExist[0].password);

  if(!truePassword) return res.status(404).json({message: 'Auth failed'});

  const token = await jwt.sign({
    sub: userExist[0]._id,
    logged:true,
  }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.status(201).json({
    message: 'User logged in',
    token
  })
  
  
};

const getRoomUsersData = async (roomId) => {
  const usersList = await RoomController.getRoomUsers(roomId);
  if(usersList.length === 0 || !usersList) return [];
  
  const usersFilteredArray = usersList.map(el => mongoose.Types.ObjectId(el.id));
  const usersData = await User.find({'_id': { $in: usersFilteredArray} });
  if(!usersData || usersData.length === 0) return [];

  return usersData;
}

const getUserInfo = async (token) => {
  const decodeToken = await jwt.decode(token);
  if(!decodeToken) return false;
  let userID = decodeToken.sub;
  const userData = await User.findById({_id:userID})
  if(!userData) return false;
  return userData;
}

const updateUserInfo = async (data) => {

  const {token, fullName, email, avatar, newPassword} = data;

  const decodeToken = await jwt.decode(token);
  if(!decodeToken) return false;
  let userID = decodeToken.sub;

  const userExist = await User.findById({_id:userID})

  if(userExist.length === 0 || !userExist) return false;

  if(email) userExist.email = email;
  if(fullName) userExist.fullName = fullName;
  if(avatar) userExist.avatar = avatar;
  if(newPassword){
    const hashedPass = await bcrypt.hash(newPassword, 10);
    userExist.password = hashedPass;
  }

  const updatedUserData = await userExist.save();

  if(!updatedUserData) return false;

  return {
    email,
    _id: userID,
    fullName,
    avatar
  };

}

const banUser = async (userID) => {

  const userExist = await User.findById({_id:userID})

  if(userExist.length === 0 || !userExist) return {message: 'User does not exist'}

  if(userExist.status === "Admin") return {message: 'You can not ban administrator'}
  
  userExist.banned = true;

  const updatedUserData = await userExist.save();

  if(!updatedUserData) return {message: 'Some error ocurred, please try again later'}

  return true;

}

const removeUserBan = async (userID) => {

  const userExist = await User.findById({_id:userID})

  if(userExist.length === 0 || !userExist) return false;

  userExist.banned = false;

  const updatedUserData = await userExist.save();

  if(!updatedUserData) return false;

  return true;

}

module.exports = {
  logIn,
  signUp,
  getRoomUsersData,
  getUserInfo,
  updateUserInfo,
  banUser,
  removeUserBan
}