// ================= ELEMENTS =================

const app = document.getElementById("app");


// ================= SPLASH SCREEN =================

window.addEventListener("load", () => {

    const splash = document.getElementById("splash-screen");

    if (splash) {

        setTimeout(() => {

            splash.style.opacity = "0";

            setTimeout(() => {
                splash.style.display = "none";
            }, 600);

        }, 2000);

    }

});


// ================= OWNER ACCESS =================

function ownerAccess(code) {

    const ownerCode = "*283141#";

    if (code === ownerCode) {

        alert("✅ Owner Access Granted");

        openAI();

    } else {

        alert("❌ Wrong Owner Code");

    }

}


// ================= OPEN AI =================

function openAI() {

    document.getElementById("login-section").style.display = "none";

    document.getElementById("signup-section").style.display = "none";

    document.getElementById("owner-section").style.display = "none";

    document.getElementById("app").style.display = "flex";

}



// ================= SIGNUP =================

function signup() {

    let username =
    document.getElementById("newUsername").value;

    let password =
    document.getElementById("newPassword").value;


    if(username === "" || password === ""){

        alert("Please fill all fields");
        return;

    }


    localStorage.setItem(
        "sibghatUser",
        JSON.stringify({
            username,
            password
        })
    );


    alert("✅ Signup Successful");

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



    if(username === user.username &&
       password === user.password){


        alert("✅ Login Successful");

        openAI();


    }else{

        alert("❌ Wrong Username or Password");

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


// ================= PROMPT BUTTON =================

function setPrompt(text){

    document.getElementById("prompt").value = text;

}



// ================= IMAGE GENERATION PLACEHOLDER =================

const generateBtn = document.getElementById("generateBtn");

if(generateBtn){

generateBtn.addEventListener("click",()=>{

    alert("AI Generator is connected next step");

});

}



// ================= HISTORY =================

const clearHistoryBtn =
document.getElementById("clearHistoryBtn");


if(clearHistoryBtn){

clearHistoryBtn.addEventListener("click",()=>{

document.getElementById("history").innerHTML="";

});

}
