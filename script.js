// ================= SIBGHAT AI SCRIPT =================


// Splash Screen

window.addEventListener("load", function(){

    const splash = document.getElementById("splash-screen");

    if(splash){

        setTimeout(function(){

            splash.style.display = "none";

        },2000);

    }

});



// Open AI App

function openAI(){

    document.getElementById("login-section").style.display = "none";

    document.getElementById("signup-section").style.display = "none";

    document.getElementById("owner-section").style.display = "none";

    document.getElementById("app").style.display = "flex";

}



// Owner Access

function ownerAccess(code){

    if(code === "*283141#"){

        alert("Owner Access Granted ✅");

        openAI();

    }else{

        alert("Wrong Owner Code ❌");

    }

}



// Signup

function signup(){

    let username = document.getElementById("newUsername").value;

    let password = document.getElementById("newPassword").value;


    if(username === "" || password === ""){

        alert("Fill all fields");

        return;

    }


    localStorage.setItem(
        "sibghatUser",
        JSON.stringify({
            username: username,
            password: password
        })
    );


    alert("Account Created ✅");

    showLogin();

}



// Login

function login(){

    let username = document.getElementById("username").value;

    let password = document.getElementById("password").value;


    let user = JSON.parse(
        localStorage.getItem("sibghatUser")
    );


    if(!user){

        alert("Please Signup First");

        return;

    }


    if(username === user.username && password === user.password){

        alert("Login Successful ✅");

        openAI();

    }else{

        alert("Wrong Username or Password ❌");

    }

}



// Show Signup

function showSignup(){

    document.getElementById("login-section").style.display="none";

    document.getElementById("signup-section").style.display="block";

}



// Show Login

function showLogin(){

    document.getElementById("signup-section").style.display="none";

    document.getElementById("login-section").style.display="block";

}



// Prompt Buttons

function setPrompt(text){

    document.getElementById("prompt").value = text;

}



// Clear History

const clearBtn = document.getElementById("clearHistoryBtn");


if(clearBtn){

    clearBtn.onclick = function(){

        document.getElementById("history").innerHTML="";

    };

}



// Test Generate Button

const generateBtn = document.getElementById("generateBtn");


if(generateBtn){

    generateBtn.onclick = function(){

        alert("SIBGHAT AI Generator Ready 🚀");

    };

}
