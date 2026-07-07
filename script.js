```javascript
// ================= ELEMENTS =================

const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const category = document.getElementById("category");

const generateBtn = document.getElementById("generateBtn");

const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");

const loading = document.getElementById("loading");

const historyContainer = document.getElementById("history");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");


// ================= WORKER URL =================

const WORKER_URL = 
"https://sibghat-ai.muhammadsibghatullahkhan8.workers.dev";


// ================= SPLASH =================

window.addEventListener("load",()=>{

const splash=document.getElementById("splash-screen");

setTimeout(()=>{

splash.style.opacity="0";

setTimeout(()=>{
splash.remove();
},600);


},2000);


});



// ================= OWNER =================

function ownerAccess(code){

const ownerCode="*283141#";


if(code===ownerCode){

alert("✅ Owner Access Granted");

document.getElementById("login-section").style.display="none";
document.getElementById("signup-section").style.display="none";
document.getElementById("owner-section").style.display="none";

document.getElementById("app").style.display="flex";


}else{

alert("❌ Wrong Code");

}

}



// ================= PROMPT BUTTONS =================

function setPrompt(text){

promptInput.value=text;

}



// ================= PROMPT BUILDER =================


function buildPrompt(text){


let extra="";


if(style.value==="Realistic")
extra+=" ultra realistic DSLR photo, 8k, cinematic lighting";


if(style.value==="Cinematic")
extra+=" cinematic movie scene, dramatic lighting";


if(style.value==="Anime")
extra+=" anime style, detailed illustration";


if(category.value==="city")
extra+=" futuristic neon city";


if(category.value==="car")
extra+=" luxury sports car";


if(category.value==="space")
extra+=" galaxy space scene";


if(category.value==="nature")
extra+=" beautiful nature landscape";


return text + extra +
", high quality, sharp details, no watermark";


}



// ================= IMAGE GENERATION =================


async function generateImage(prompt){


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

});


const data = await response.json();


console.log(data);


// Worker se image lena

if(!data.image){

throw new Error(
"No image received from AI"
);

}


return data.image;


}



// ================= GENERATE BUTTON =================


generateBtn.addEventListener("click",async()=>{


const text=promptInput.value.trim();



if(!text){

alert("Please enter prompt");

return;

}



loading.classList.remove("hidden");

resultImage.style.display="none";

downloadBtn.classList.add("hidden");



try{


const finalPrompt=buildPrompt(text);


const imageURL=
await generateImage(finalPrompt);



resultImage.src=imageURL;



resultImage.onload=()=>{


loading.classList.add("hidden");

resultImage.style.display="block";


downloadBtn.href=imageURL;

downloadBtn.download="sibghat-ai-image.png";

downloadBtn.classList.remove("hidden");


};



saveHistory(text);



}

catch(error){


loading.classList.add("hidden");


alert(error.message);


}



});



// ================= HISTORY =================


function saveHistory(prompt){


let item=document.createElement("p");

item.innerText="• "+prompt;


historyContainer.appendChild(item);


}



// ================= CLEAR HISTORY =================


clearHistoryBtn.addEventListener("click",()=>{

historyContainer.innerHTML="";

});



// ================= SIMPLE LOGIN =================


function signup(){

alert("Signup system ready");

}


function login(){

document.getElementById("login-section").style.display="none";

document.getElementById("owner-section").style.display="block";

}


function showSignup(){

document.getElementById("login-section").style.display="none";

document.getElementById("signup-section").style.display="block";

}


function showLogin(){

document.getElementById("signup-section").style.display="none";

document.getElementById("login-section").style.display="block";

}
```
