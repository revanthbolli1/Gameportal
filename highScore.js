var highscore=0;
var mcnt=0,tcnt=0;
const check=(score)=>{
  if(score>highscore){
    highscore=score;
  }
  return highscore;
}

const checkMem=()=>{
  mcnt++;
  if(mcnt===1){
     return true;
  }
  else{
    return false;
  }
}

const checkTic=()=>{
  tcnt++;
  if(tcnt===1){
     return true;
  }
  else{
    return false;
  }
  
}

module.exports={check,checkMem,checkTic};