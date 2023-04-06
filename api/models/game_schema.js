const { Schema } = require('mongoose')
const mongoose= require('mongoose')
const Timestamp=require('time-stamp');
const gameSchema= new mongoose.Schema({

      GameName: {
        type: String,
        required: true
      },
      GameType:{
        type:String,
        required:true
      },
      IsActive:{
        type: Boolean,
        default: true
      },
      LastUpdated:{
        type: String,
        required:true
      }
    });
  
const game= mongoose.model('game', gameSchema)

module.exports= game;
