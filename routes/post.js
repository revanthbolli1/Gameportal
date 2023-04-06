const express=require('express');
const router=express.Router();
const jwt= require('jsonwebtoken');
const mongoose=require('mongoose');
const nodemailer=require('nodemailer');
const bcrypt = require("bcryptjs")
const {createToken,checkingToken}=require('../auth');
const cookieParser=require('cookie-parser');
router.use(cookieParser());
const {check,checkMem,checkTic}=require('../highScore');
const moment=require('moment');
const session=require('session');

const User=require('../api/models/registerSchema');
const UGame=require('../api/models/userGameschema');
const game=require('../api/models/game_schema');

//database connection
const db=mongoose.connection;

//create jwt secret --- hardcoding jwt secret here insted of creating .env file
//const JWT_SECRET = 'some super secret..'


//register
router.post('/register', async (req, res) => {
  console.log('post method called');
  try {
    const playerName = req.body.playername;
    const email = req.body.email;
    let password = req.body.password;
    console.log(req.body);
    // check if playerName or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ PlayerName: playerName }, { Email: email }] });
    if (existingUser) {
      const msg = 'Username or email already exists.';
      return res.render('register', { msg });
    }
    let formattedDate=moment(Date.now()).format('MMM D, YYYY, h:mm:ss a')
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    password = hashedPassword;
    const data = new User({
      PlayerName: playerName,
      Email: email,
      Password: password,
      CreatedAt: formattedDate
    });
    await data.save();
    console.log('Record inserted successfully');
    res.redirect('/login');
  } catch (err) {
    console.log('Error: ' + err);
    if (err.name === 'MongoError' && err.code === 11000) {
      // duplicate key error
      const msg = 'Username or email already exists.';
      return res.render('register', { msg });
    }
    return res.status(500).send('Server error');
  }
});

// setup route to handle login submission
router.post('/login', async(req,res)=>
{
    res.cookie('token', '', { maxAge: 0 });
    res.cookie('user', '', { maxAge: 0 });  
    const {email, password} =req.body
    console.log(req.body)
    
    try {
    let user = await User.findOne({ Email: email });
    

    if (!user) {
    // Handle case where user is not found
   return res.render('login',{msg:"User not Registered"});

    }
    let result = await bcrypt.compare(password, user.Password)
    if (result === false) {
       return  res.status(400).send({ message: "Invalid password" })
    }
    
    res.cookie('user', user, { httpOnly: true, secure: true, maxAge: 3600000 });
    const token = createToken(user);
    console.log(token);
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });
    
    return  res.redirect('/homepage');  
  
    } catch (error) {
        console.error(error);
    return res.status(500).json({message:'Internal Server Error'});
        }
})



//memorygame
router.post('/game',checkingToken,async(req,res)=>{
  console.log("game post route called");
  try{
    let value;
    const {  score } = req.body;
    console.log("score"+score);
     // Access user information from the cookie user
     let user = req.cookies.user;
     let userid=user._id;
     console.log("id"+userid);
     let gameid;
     let formattedDate=moment(Date.now()).format('MMM D, YYYY, h:mm:ss a')
   
    // Find the game data
    let gameData = await game.findOne({ GameName: "memorygame" });
    
    // If there is no game data, create a new game
    if (!gameData) {
      let gameName = 'memorygame'
      let gameType='scorebased'
      const newGame = new game({
        GameName: gameName,
        GameType:gameType,
        LastUpdated: formattedDate
      });
      const savedGame = await newGame.save();
      
      // Store the first game ID in the variable
      gameid= savedGame._id;
      console.log('First game ID:',gameid);
    }
    // Get the game ID
    else{
     gameid = gameData._id;
    }
    const userGameData = new UGame({
      UserId: userid,
      GameId: gameid,
      PlayedAt: formattedDate,
      Score: score
    });
    
    // Save the user game record to the database
    await userGameData.save();
  }
  catch(err){
    return console.log('ERROR'+err);
  }
})

//tictactoe game
router.post('/tictactoe',checkingToken,async(req,res)=>{
  console.log("tictactoe post route called");
  try{
   let status;

    const {  result } = req.body;
  console.log(result);
  if(result===`You won!`){
    status="W";
  }
  else if(result===`You Lose!`){
    status="L";
  }
  else{
    status="D";
  }
  // Access user information from the cookie user
  let user = req.cookies.user;
  let userid=user._id;
  let gameid;
  let formattedDate=moment(Date.now()).format('MMM D, YYYY, h:mm:ss a')
  
   // Find the game data
   let gameData = await game.findOne({ GameName: "tictactoe" });
   
   // If there is no game data, create a new game
   if (!gameData) {
     let gameName = 'tictactoe'
     let gameType='WinORLose'
     const newGame = new game({
       GameName: gameName,
       GameType:gameType,
       LastUpdated: formattedDate
     });
     const savedGame = await newGame.save();
     // Store the first game ID in the variable
     gameid= savedGame._id;
     console.log('First game ID:',gameid);
    }
   // Get the game ID
   else{
    gameid = gameData._id;
   }
   const userGameData = new UGame({
     UserId: userid,
     GameId: gameid,
     PlayedAt: formattedDate,
     Status: status
   });
   // Save the user game record to the database
   await userGameData.save();
  }
  catch(err){
    return console.log('ERROR'+err);
  }
});


//forgot-password
router.post("/forgot-password", async (req, res, next) => {
  const { email } = req.body;
  try {
    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('forgot-password',{msg:"User not registered"});
      
    }
    // If user exists, generate a one-time link with a short expiry time
    const payload = { email: user.email, id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    const link = `http://localhost:8080/reset-password/${user._id}/${token}`;
    console.log("sending password reset email");
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.email,
        pass: process.env.password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // send mail with defined transport object
    try{
    let info = await transporter.sendMail({
      from: process.env.email, // sender email address
      to: email, // list of receivers
      subject: "Password Reset Link", // Subject line
      //text: `Please use the following link to reset your password: ${link}`, // plain text body
      html: `<p>Please use the following link to reset your password:</p><a href="${link}">Reset Password link</a>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  catch(err){
  console.error('Error sending password reset email:',err);
  }
   // console.log("Message sent: %s", info.messageId);


    res.render('forgot-password',{msg:"Please check your email for password reset link"});
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});


//reset-password
router.post("/reset-password/:id/:token",async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { password, confirmpassword } = req.body;
    console.log(password, confirmpassword);
    if (password !== confirmpassword) {
      return res.render('reset-password',{ msg: "Passwords do not match" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const email = payload.email;
    const user = await User.findOne({ _id: id, email: email });
    const now = Math.floor(Date.now() / 1000); // get current time in seconds
    if (payload.exp && now > payload.exp) {
      return res.render('forgot-password',{ msg: "Reset link has expired" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res.redirect('/login');
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});




module.exports=router;
