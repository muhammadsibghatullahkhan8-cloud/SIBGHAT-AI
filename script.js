// ================= SIBGHAT AI V2 + VOICE SCRIPT =================


// WORKER URL

const WORKER_URL =
"https://sibghat-ai.muhammadsibghatullahkhan8.workers.dev";




// ================= LOAD =================

window.addEventListener("load",()=>{


const splash=document.getElementById("splash-screen");


if(splash){

setTimeout(()=>{

splash.style.display="none";

},2000);

}



if(localStorage.getItem("theme")==="light"){

document.body.classList.add("light");

}


updateThemeButton();


loadHistory();

loadFavorites();

loadGallery();

loadCounter();

loadCredits();


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

alert("Signup first");

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








// ================= VOICE PROMPT =================


const voiceBtn =
document.getElementById("voiceBtn");


if(voiceBtn){



voiceBtn.onclick=()=>{


let SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;



if(!SpeechRecognition){


alert("Your browser does not support voice input");


return;


}



let recognition =
new SpeechRecognition();



recognition.lang="en-US";

recognition.continuous=false;

recognition.interimResults=false;



let status =
document.getElementById("voiceStatus");



status.innerHTML="🎙️ Listening...";



recognition.start();





recognition.onresult=(event)=>{


let text =
event.results[0][0].transcript;



document.getElementById("prompt").value=text;


status.innerHTML=
"✅ Voice converted";


};





recognition.onerror=()=>{


status.innerHTML=
"❌ Voice error";


};



recognition.onend=()=>{


setTimeout(()=>{


status.innerHTML="";


},3000);


};



};


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



localStorage.setItem(

"theme",

document.body.classList.contains("light")
?
"light"
:
"dark"

);



updateThemeButton();


};


}




function updateThemeButton(){


let btn=document.getElementById("themeBtn");


if(!btn)return;



btn.innerHTML =
document.body.classList.contains("light")
?
"☀️ Light"
:
"🌙 Dark";


}









// ================= LOADING =================


function startLoading(){


document.getElementById("loading")
.classList.remove("hidden");



let text =
document.getElementById("loadingText");



let steps=[

"✨ Understanding prompt...",
"🎨 Creating image...",
"⚡ Enhancing quality...",
"🚀 Finishing..."

];



let i=0;


window.timer=setInterval(()=>{


text.innerHTML=steps[i];


i++;


if(i>=steps.length)i=0;


},1000);



}





function stopLoading(){


clearInterval(window.timer);


document.getElementById("loading")
.classList.add("hidden");


}








// ================= GENERATE IMAGE =================


const generateBtn =
document.getElementById("generateBtn");



if(generateBtn){



generateBtn.onclick=async()=>{



let prompt =
document.getElementById("prompt").value.trim();



if(!prompt){

alert("Enter prompt");

return;

}



let credits =
Number(localStorage.getItem("credits") || 100);



if(credits<=0){

alert("No credits");

return;

}




let style =
document.getElementById("style").value;


let model =
document.getElementById("model").value;


let size =
document.getElementById("size").value;


let quality =
document.getElementById("quality").value;


let negative =
document.getElementById("negativePrompt").value;






prompt +=
`
${style},
${quality},
${size},
${negative},
ultra realistic,
high detail,
professional photography
`;





generateBtn.disabled=true;


startLoading();



try{


let response =
await fetch(

WORKER_URL,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

prompt,

model,

size,

quality


})

}

);




let data =
await response.json();



let imageURL =
data.image ||
data.imageUrl ||
data.url;



if(!imageURL){

throw Error("Image not received");


}




let img =
document.getElementById("resultImage");



img.src=imageURL;



img.onload=()=>{


stopLoading();


generateBtn.disabled=false;



document.getElementById("downloadBtn").href=imageURL;


document.getElementById("downloadBtn")
.classList.remove("hidden");



document.getElementById("favoriteBtn")
.classList.remove("hidden");



document.getElementById("shareBtn")
.classList.remove("hidden");



saveHistory(imageURL);

saveGallery(imageURL);

increaseCounter();

useCredit();


};



}catch(error){


stopLoading();

generateBtn.disabled=false;


alert(
"AI Error: "+error.message
);


}



};



}








// ================= CREDIT =================


function useCredit(){


let c =
Number(localStorage.getItem("credits")||100);


c--;


localStorage.setItem("credits",c);


loadCredits();


}



function loadCredits(){


let box =
document.getElementById("credits");


if(box){

box.innerHTML =
localStorage.getItem("credits")||100;

}


}







// ================= HISTORY =================


function saveHistory(url){


let h =
JSON.parse(localStorage.getItem("sibghatHistory"))
||[];



h.unshift(url);


h=h.slice(0,10);



localStorage.setItem(
"sibghatHistory",
JSON.stringify(h)
);



loadHistory();


}




function loadHistory(){


let box=document.getElementById("history");


if(!box)return;



box.innerHTML="";



let h=
JSON.parse(localStorage.getItem("sibghatHistory"))
||[];



h.forEach(url=>{


box.innerHTML+=`

<div class="history-card">

<img src="${url}">

</div>

`;


});


}







// ================= FAVORITES =================


let favoriteBtn =
document.getElementById("favoriteBtn");


if(favoriteBtn){


favoriteBtn.onclick=()=>{


let img =
document.getElementById("resultImage").src;



let f =
JSON.parse(localStorage.getItem("favorites"))
||[];



f.unshift(img);



localStorage.setItem(
"favorites",
JSON.stringify(f)
);



loadFavorites();


};


}




function loadFavorites(){


let box=document.getElementById("favorites");


if(!box)return;



box.innerHTML="";


let f =
JSON.parse(localStorage.getItem("favorites"))
||[];



f.forEach(url=>{


box.innerHTML+=`

<div class="favorite-card">

<img src="${url}">

</div>

`;


});


}








// ================= GALLERY =================


function saveGallery(url){


let g =
JSON.parse(localStorage.getItem("gallery"))
||[];


g.unshift(url);


g=g.slice(0,20);



localStorage.setItem(
"gallery",
JSON.stringify(g)
);



loadGallery();


}




function loadGallery(){


let box=document.getElementById("galleryBox");


if(!box)return;



box.innerHTML="";


let g =
JSON.parse(localStorage.getItem("gallery"))
||[];



g.forEach(url=>{


box.innerHTML+=`

<img src="${url}">

`;

});


}







// ================= COUNTER =================


function increaseCounter(){


let c =
Number(localStorage.getItem("generatedCount")||0);


c++;


localStorage.setItem(
"generatedCount",
c
);


loadCounter();


}




function loadCounter(){


let c=document.getElementById("counter");


if(c){

c.innerHTML=
localStorage.getItem("generatedCount")||0;

}


}








// ================= SHARE =================


let shareBtn =
document.getElementById("shareBtn");



if(shareBtn){


shareBtn.onclick=()=>{


let url =
document.getElementById("resultImage").src;



if(navigator.share){


navigator.share({

title:"SIBGHAT AI",

url:url

});


}


};


}








// ================= CLEAR HISTORY =================


let clearBtn =
document.getElementById("clearHistoryBtn");



if(clearBtn){


clearBtn.onclick=()=>{


localStorage.removeItem(
"sibghatHistory"
);



document.getElementById("history").innerHTML="";


};


}
