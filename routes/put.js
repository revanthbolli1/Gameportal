const game= require('../api/models/game_schema');
const express=require('express');
const router=express.Router();
const moment=require('moment');
const {checkingToken}=require('../auth');

router.put('/gamedetails/:id',checkingToken, (req, res) => {
  game.findByIdAndUpdate(
    req.params.id,
    {
      GameName: req.body.GameName,
      IsActive: req.body.IsActive,
      LastUpdated: req.body.LastUpdated
    },
    { new: true },
    (err, updatedGame) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating game');
      } else {
        return res.json(updatedGame);
      }
    }
  );
});

module.exports=router;