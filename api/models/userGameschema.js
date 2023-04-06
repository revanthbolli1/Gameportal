const mongoose = require("mongoose");
const User = require("./registerSchema");
const game = require("./game_schema");
const moment=require('moment');
// const Timestamp=require('time-stamp');
const userGameSchema = new mongoose.Schema({
  UserId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User
  },
  GameId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: game
  },
  Score:{
  type:Number
  },
  Status:{
   type:String
  },
  PlayedAt: {
    type: String,
    required:true
  }
});

const UGame = mongoose.model("UGame", userGameSchema);

module.exports = UGame;
