const express=require('express');
const jwt= require('jsonwebtoken')
const mongoose=require('mongoose');
const nodemailer=require('nodemailer');
const db=mongoose.connection;
const router=express.Router();

const User=require('../api/models/registerSchema');
const UGame=require('../api/models/userGameschema');
const game= require('../api/models/game_schema');

const {checkingToken}=require('../auth');
const cookieParser=require('cookie-parser');
router.use(cookieParser());
const session=require('session');




//create jwt secret --- hardcoding jwt secret here insted of creating .env file
//const JWT_SECRET = 'some super secret..'

//get request for getting all the data stored in db
router.get('/users',checkingToken,async(req,res)=>{
  try{
    const routes= await User.find()
    res.json(routes);
  }
  catch(err){
    res.send("Error"+err);
  }
})

router.get('/gamedetails',checkingToken, async(req,res)=>{

  try {
    const data = await game.find().lean();
    return res.json({ msg: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

//index route
router.get('/',(req,res)=>{
  res.render('index');
})

//setup route to register page
router.get("/register", (req, res) => {
  res.render("register"); //call register page
});

//setup route to login page
router.get('/login', (req, res) => {
  res.cookie('token', '', { maxAge: 0 });
  res.cookie('user', '', { maxAge: 0 });  
  res.render('login'); //call login page
});


//home-page
router.get('/homepage',checkingToken,(req,res)=>{
 return  res.render('homepage');
})

//logout
router.get('/logout', (req, res) => {
  res.cookie('token', '', { maxAge: 0 });
  res.cookie('user', '', { maxAge: 0 });
 //res.clearCookie('cook');
 res.redirect('/login'); // Redirect the user to the login page after logout

});

//memorygame
router.get('/game',checkingToken,(req,res)=>{
  res.render('memorygame');
})
// tictactoe
router.get('/tictactoe', checkingToken,async (req, res) => {
  res.render('tictactoe');

});

// Get dashboard data for all players
    router.get('/dashboard', checkingToken,async (req, res) => {
    try {
        console.log("yeah")
        let user = req.cookies.user;
        let userid=user._id;
        let gameid;
        
        //memorygame dasahboard
        let gamedata=await game.findOne({GameName:"memorygame"});
        //console.log(gamedata);
        gameid=gamedata._id;
        console.log(gameid);
        let highScoreData = await UGame.find({UserId:userid, GameId: gameid }).sort({ Score: -1 }).limit(1).exec();
        console.log(highScoreData);
        let highScore = highScoreData.length > 0 ? highScoreData[0].Score : 0;
        console.log(highScore);
        
        //tictactoe game
        let gamedata1=await game.findOne({GameName:"tictactoe"});
        gameid=gamedata1._id;
        console.log(gameid);
        let gamesPlayed=await UGame.find({UserId:userid,GameId:gameid}).exec();
        let playlen=gamesPlayed.length;
        let gamesWon=await UGame.find({UserId:userid,GameId:gameid,Status:"W"}).exec();
        let wonlen=gamesWon.length;
        console.log("played"+playlen);
        console.log("won"+wonlen);
        const winratio = wonlen/playlen;
        let value=` ${wonlen}/${playlen}`;
        const obj={msg:highScore,msg1:value}
        return res.render('dashboard',obj);//, { usergames},{usergames2});
        
     } 
     catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
});

   

// forgot password form
router.get('/forgot-password', (req, res, next) => {
  res.render('forgot-password');
});


//reset-password
router.get("/reset-password/:id/:token", async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const email = payload.email;
    const user = await User.findOne({ _id: id, email: email });
    if (!user) {
      return res.render({ msg: "Invalid reset link" });
    }
    const now = Math.floor(Date.now() / 1000); // get current time in seconds
    if (payload.exp && now > payload.exp) {
      return res.render('forgot-password',{ msg: "Reset link has expired" });
    }
    // render the reset password form
    return res.render("reset-password", {
      id: id,
      token: token,
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.render('forgot-password',{ msg: "Reset link has expired" });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET method to retrieve the tictactoe game data for a specific player
router.get('/tictactoe', checkingToken,async (req, res) => {
  res.render('tictactoe');

});

module.exports=router;
