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


// ================= LOAD THEME =================

if(localStorage.getItem("theme")==="light"){

document.body.classList.add("light");

}


const themeBtn=document.getElementById("themeBtn");

if(themeBtn){

if(document.body.classList.contains("light")){

themeBtn.innerHTML="☀️ Light";

}else{

themeBtn.innerHTML="🌙 Dark";

}

}


loadHistory();
loadFavorites();
loadCounter();

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
username,
password
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





// ================= PROMPT =================

function setPrompt(text){

document.getElementById("prompt").value=text;

}





// ================= THEME =================


const themeBtn =
document.getElementById("themeBtn");


if(themeBtn){


themeBtn.onclick=()=>{


document.body.classList.toggle("light");



if(document.body.classList.contains("light")){


localStorage.setItem(
"theme",
"light"
);


themeBtn.innerHTML="☀️ Light";



}else{


localStorage.setItem(
"theme",
"dark"
);


themeBtn.innerHTML="🌙 Dark";


}


};


}






// ================= LOADING =================

function startLoading(){

let text=document.getElementById("loadingText");

let loading=document.getElementById("loading");


loading.classList.remove("hidden");


let steps=[

"✨ Understanding prompt...",

"🎨 Creating details...",

"⚡ Enhancing quality...",

"🚀 Finalizing image..."

];


let i=0;


window.loadingInterval=setInterval(()=>{

text.innerHTML=steps[i];

i++;

if(i>=steps.length){

i=0;

}

},1000);


}



function stopLoading(){

clearInterval(window.loadingInterval);

document.getElementById("loading")
.classList.add("hidden");

}





// ================= GENERATE IMAGE =================


const generateBtn =
document.getElementById("generateBtn");



if(generateBtn){


generateBtn.onclick=async function(){


let prompt =
document.getElementById("prompt").value.trim();



if(!prompt){

alert("Enter prompt first");

return;

}



let img =
document.getElementById("resultImage");


let download =
document.getElementById("downloadBtn");



startLoading();


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

prompt

})

}

);



const data =
await response.json();



console.log(data);



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


stopLoading();


img.style.display="block";



download.href=imageURL;

download.download=
"SIBGHAT-AI-"+Date.now()+".png";


download.classList.remove("hidden");



document.getElementById("favoriteBtn")
.classList.remove("hidden");



document.getElementById("shareBtn")
.classList.remove("hidden");



saveHistory(imageURL);

increaseCounter();


};



}


catch(error){


stopLoading();


alert(
"AI Error: "+error.message
);


}



};


}






// ================= HISTORY =================


function saveHistory(url){

let history =
JSON.parse(
localStorage.getItem("sibghatHistory")
)||[];


history.unshift(url);


history=history.slice(0,10);


localStorage.setItem(
"sibghatHistory",
JSON.stringify(history)
);


loadHistory();

}




function loadHistory(){

let box=document.getElementById("history");


if(!box)return;


box.innerHTML="";


let history =
JSON.parse(
localStorage.getItem("sibghatHistory")
)||[];


history.forEach(img=>{


box.innerHTML+=`

<div class="history-card">

<img src="${img}">

</div>

`;


});


}






// ================= FAVORITES =================


const favoriteBtn=document.getElementById("favoriteBtn");


if(favoriteBtn){

favoriteBtn.onclick=()=>{


let img=document.getElementById("resultImage").src;


let fav=
JSON.parse(localStorage.getItem("favorites"))
||[];


fav.unshift(img);


localStorage.setItem(
"favorites",
JSON.stringify(fav)
);


loadFavorites();


alert("Added to Favorites ❤️");


};

}





function loadFavorites(){

let box=document.getElementById("favorites");


if(!box)return;


box.innerHTML="";


let fav=
JSON.parse(localStorage.getItem("favorites"))
||[];


fav.forEach(img=>{


box.innerHTML+=`

<div class="favorite-card">

<img src="${img}">

</div>

`;


});


}






// ================= SHARE =================


const shareBtn=document.getElementById("shareBtn");


if(shareBtn){

shareBtn.onclick=()=>{


let url=document.getElementById("resultImage").src;


if(navigator.share){

navigator.share({

title:"SIBGHAT AI",

url:url

});

}else{

alert("Share not supported");

}


};


}






// ================= COUNTER =================


function increaseCounter(){

let count=
Number(localStorage.getItem("generatedCount"))
||0;


count++;


localStorage.setItem(
"generatedCount",
count
);


loadCounter();

}



function loadCounter(){

let counter=document.getElementById("counter");


if(counter){

counter.innerText=
localStorage.getItem("generatedCount")
||0;

}

}





// ================= CLEAR HISTORY =================


const clearHistoryBtn =
document.getElementById("clearHistoryBtn");


if(clearHistoryBtn){

clearHistoryBtn.onclick=()=>{


localStorage.removeItem(
"sibghatHistory"
);


document.getElementById("history").innerHTML="";


};

}
