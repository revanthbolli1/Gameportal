const form = document.querySelector('form');
const playername = document.getElementsByClassName("input")[0];
const email = document.getElementsByClassName("input")[1];
const password = document.getElementsByClassName("input")[2]
const cpassword = document.getElementsByClassName("input")[3];



const isValidEmail = email =>{
    const rex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rex.test(String(email).toLowerCase());
}
form.addEventListener('submit', e =>{
    e.preventDefault();
    validate();
});


const errorMsg = (ele, msg)=>{
    const control=ele.parentElement;
    const errortxt=control.querySelector(".error");
    errortxt.innerText=msg;
    control.classList.add("error");
    control.classList.remove('success');
};

const successMsg = ele=>{
    const control=ele.parentElement;
    const errortxt=control.querySelector(".error");
    errortxt.innerText="";
    control.classList.add("success");
    control.classList.remove('error')
}

const validate= ()=>{
    const playernameValue = playername.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const cpasswordValue = cpassword.value.trim();
    let count=0;
    
    if (playernameValue===''){
        errorMsg(playername, 'Playername is required');
    }
    else{
        successMsg(playername);
        count +=1;
    }

    if(emailValue===""){
        errorMsg(email,"Email is required");
    }
    else if(!isValidEmail(emailValue)){
        errorMsg(email,"Provide a valid email address");
    }
    else{
        successMsg(email);
        count +=1;
    }

    if(passwordValue=== ""){
        errorMsg(password,"Password is required");
    }
    else if(passwordValue.length < 8){
        errorMsg(password,"Password must be at least 8 character.");
    }
    else if(passwordValue.length >16){
        errorMsg(password,"Password must be atmost  16 character.");
    }
    else{
        successMsg(password);
        count+=1;
    }

    if(cpasswordValue=== ""){
        errorMsg(cpassword,"Please confirm your password");
    }
    else if(cpasswordValue!==passwordValue){
        errorMsg(cpassword,"Password doesn't match.");
    }
    else{
        successMsg(cpassword);
        count+=1;
    }


    if(count===4){
        form.submit();
    }
}
