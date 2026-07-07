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

if(splash){

setTimeout(()=>{

splash.style.opacity="0";

setTimeout(()=>{

splash.remove();

},600);

},2000);

}

});




// ================= OWNER ACCESS =================

function ownerAccess(code){

const ownerCode="*283141#";


if(code===ownerCode){

alert("✅ Owner Access Granted");


document.getElementById("login-section").style.display="none";

document.getElementById("signup-section").style.display="none";

document.getElementById("owner-section").style.display="none";


document.getElementById("app").style.display="flex";


}

else{

alert("❌ Wrong Owner Code");

}

}





// ================= SIGNUP =================


function signup(){


const username =
document.getElementById("newUsername").value;


const password =
document.getElementById("newPassword").value;



if(!username || !password){

alert("Please fill all fields");

return;

}



localStorage.setItem(

"sibghatUser",

JSON.stringify({

username:username,

password:password

})

);



alert("✅ Account Created");


showLogin();


}






// ================= LOGIN =================


function login(){


const username =
document.getElementById("username").value;


const password =
document.getElementById("password").value;



const user =
JSON.parse(localStorage.getItem("sibghatUser"));



if(!user){

alert("❌ Please signup first");

return;

}



if(username===user.username &&
password===user.password){


alert("✅ Login Successful");


document.getElementById("login-section").style.display="none";

document.getElementById("owner-section").style.display="none";

document.getElementById("app").style.display="flex";


}

else{


alert("❌ Incorrect login details");


}


}







// ================= SHOW LOGIN/SIGNUP =================


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

promptInput.value=text;

}





// ================= BUILD PROMPT =================


function buildPrompt(text){


let extra="";



if(style.value==="Realistic"){

extra+=" ultra realistic DSLR photography, 8K, cinematic lighting";

}


if(style.value==="Cinematic"){

extra+=" cinematic movie scene, dramatic lighting";

}


if(style.value==="Anime"){

extra+=" anime style, detailed artwork";

}




if(category.value==="city"){

extra+=" futuristic neon city";

}


if(category.value==="car"){

extra+=" luxury sports car";

}


if(category.value==="space"){

extra+=" galaxy and outer space";

}


if(category.value==="nature"){

extra+=" beautiful nature landscape";

}



return text + extra +
", high quality, sharp details, no watermark";

}







// ================= GENERATE IMAGE =================


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

}

);



const data = await response.json();



console.log(data);



if(!data.image){

throw new Error("No image received from AI");

}



return data.image;



}






// ================= GENERATE BUTTON =================


generateBtn.addEventListener("click",async()=>{


const text =
promptInput.value.trim();



if(!text){

alert("Enter your prompt");

return;

}




loading.classList.remove("hidden");


resultImage.style.display="none";


downloadBtn.classList.add("hidden");




try{


const finalPrompt =
buildPrompt(text);



const imageURL =
await generateImage(finalPrompt);



resultImage.src=imageURL;



resultImage.onload=()=>{


loading.classList.add("hidden");


resultImage.style.display="block";


downloadBtn.href=imageURL;

downloadBtn.download="SIBGHAT-AI.png";


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


function saveHistory(text){


const item=document.createElement("p");


item.innerText="• "+text;


historyContainer.appendChild(item);


}




clearHistoryBtn.addEventListener("click",()=>{


historyContainer.innerHTML="";


});
```
