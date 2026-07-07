// ================= SIBGHAT AI SCRIPT =================


// Worker URL
const WORKER_URL =
"https://sibghat-ai.muhammadsibghatullahkhan8.workers.dev";



// ================= SPLASH =================

window.addEventListener("load",()=>{

const splash=document.getElementById("splash-screen");

if(splash){

setTimeout(()=>{

splash.style.display="none";

},2000);

}

});



// ================= OPEN APP =================

function openAI(){

document.getElementById("login-section").style.display="none";

document.getElementById("signup-section").style.display="none";

document.getElementById("owner-section").style.display="none";

document.getElementById("app").style.display="flex";

}



// ================= OWNER =================

function ownerAccess(code){

if(code==="*283141#"){

alert("Owner Access Granted ✅");

openAI();

}else{

alert("Wrong Code ❌");

}

}




// ================= SIGNUP =================

function signup(){

let username =
document.getElementById("newUsername").value;

let password =
document.getElementById("newPassword").value;


if(!username || !password){

alert("Fill all fields");

return;

}


localStorage.setItem(

"sibghatUser",

JSON.stringify({

username:username,

password:password

})

);


alert("Signup Successful ✅");

showLogin();

}




// ================= LOGIN =================

function login(){

let username =
document.getElementById("username").value;


let password =
document.getElementById("password").value;


let user =
JSON.parse(localStorage.getItem("sibghatUser"));



if(!user){

alert("Please signup first");

return;

}



if(username===user.username &&
password===user.password){


alert("Login Successful ✅");

openAI();


}else{

alert("Wrong Login ❌");

}

}




// ================= PAGE SWITCH =================

function showSignup(){

document.getElementById("login-section").style.display="none";

document.getElementById("signup-section").style.display="block";

}



function showLogin(){

document.getElementById("signup-section").style.display="none";

document.getElementById("login-section").style.display="block";

}




// ================= PROMPT BUTTONS =================

function setPrompt(text){

document.getElementById("prompt").value=text;

}





// ================= GENERATE IMAGE =================


const generateBtn =
document.getElementById("generateBtn");



if(generateBtn){


generateBtn.onclick = async function(){


let prompt =
document.getElementById("prompt").value.trim();



if(!prompt){

alert("Enter prompt first");

return;

}



let loading =
document.getElementById("loading");


let img =
document.getElementById("resultImage");


let download =
document.getElementById("downloadBtn");



loading.classList.remove("hidden");

img.style.display="none";

download.classList.add("hidden");




try{


const response = await fetch(

WORKER_URL,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

prompt:prompt

})

}

);



const data = await response.json();


console.log(data);



// different possible image locations

let imageURL =
data.image ||
data.imageUrl ||
data.url;



if(!imageURL){

throw new Error(
"Image not received from Worker"
);

}



img.src=imageURL;


img.onload=()=>{


loading.classList.add("hidden");

img.style.display="block";


download.href=imageURL;

download.download="SIBGHAT-AI.png";

download.classList.remove("hidden");


};



}

catch(error){


loading.classList.add("hidden");


alert(
"AI Error: "+error.message
);


}



};


}




// ================= HISTORY =================


const clearHistoryBtn =
document.getElementById("clearHistoryBtn");


if(clearHistoryBtn){

clearHistoryBtn.onclick=()=>{

document.getElementById("history").innerHTML="";

};

}
