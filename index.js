const express=require('express');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const session=require('express-session');
const path=require('path');
require('dotenv').config();

const postRouter=require('./routes/post');
const getRouter=require('./routes/get');
const game=require('./api/models/game_schema');
const User=require('./api/models/registerSchema');
const UGame=require('./api/models/userGameschema');
const {checkingToken}=require('./auth');
const cookieParser=require('cookie-parser');
const {value,token1}=require('./tokenFunc');

//app started
const app=express();
app.use(cookieParser());

const url='mongodb://localhost/Gamezone';

mongoose.connect(url);

const db=mongoose.connection;
db.on('error',()=>{
  console.log("Error in connecting to database");
})
db.once('open',()=>console.log("Connected to database"));

//path
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

//middleware for parsing JSON 
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
//to get styles,css,images,scripts 
app.use(express.static(__dirname + '/public'));

//login page
const getLogin= require('./routes/get')
app.use('/', getLogin)
const postLogin= require('./routes/post')
app.use('/', postLogin)

//creating a new game and updating the existing game details
const getNewGame= require('./routes/get')
app.use('/', getNewGame)

const addNewGame= require('./routes/post')
app.use('/', addNewGame)

const updateGame= require('./routes/put')
app.use('/', updateGame)



//forgot-password and reset
const frgt_pwd= require('./routes/get')
app.use('/', frgt_pwd)

const  post_frgt_pwd= require('./routes/post')
app.use('/',post_frgt_pwd)

//dashboard
const get_dashb= require('./routes/get')
app.use('/', get_dashb)

const post_dashb= require('./routes/post')
app.use('/', post_dashb)

//homepage
const get_home= require('../homepage')
app.use('/', get_home)

//logout
const get_logout= require('./routes/get')
app.use('/', get_logout)


//register
app.get('/register',(req,res)=>{
  res.render('register');
})

//memorygame
app.get('/game',checkingToken,(req,res)=>{
  res.render('memorygame');
})

app.use('/users',getRouter);

//server call
app.listen(8080,()=>{
  console.log("connected to server at port 8080");
})

module.exports=db;
