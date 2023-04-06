var modal = document.getElementById("myModal");
var closeButton = modal.querySelector(".close");
var buttons=document.querySelectorAll("button");
buttons.forEach((button)=>{
    button.addEventListener("click", showModal);
})


function showModal(){
    const gname= this.parentElement.parentElement.firstElementChild.innertext;
    const game={
        name:gname
    };
    
    fetch('/dashboard', {                         ///sending game name to backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game)
      })
      .then(response => response.json())
      .then(data => console.log(data))  
      .catch(error => console.error(error));


    modal.classList.add("show");
    modal.style.display = "block";
}

closeButton.onclick = function() {
    modal.style.display = "none";
    modal.classList.remove("show");
}       

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        modal.classList.remove("show");
    }
}       


    
      
   


