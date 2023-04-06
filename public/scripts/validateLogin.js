const axios=require('axios');
const form = document.querySelector('form');
const email = document.getElementsByClassName("input")[0];
const password = document.getElementsByClassName("input")[1]


const isValidEmail = email =>{
    const rex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rex.test(String(email).toLowerCase());
}
form.addEventListener('submit', e =>{
    e.preventDefault();
    validateLogin();
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

const validateLogin= ()=>{
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    let count=0;
    

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
    else{
        successMsg(password);
        count+=1;
    }

    if(count===2){
        form.submit();
    }
}


