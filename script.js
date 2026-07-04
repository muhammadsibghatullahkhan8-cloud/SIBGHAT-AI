const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

/* ================= USER SYSTEM ================= */
let user = {
    plan: "free",
    credits: 5,
    maxCredits: 5
};

/* ---------------- INIT ---------------- */
window.addEventListener("load", () => {
    const splash = document.getElementById("splash-screen");

    setTimeout(() => {
        if (splash) {
            splash.style.opacity = "0";
            setTimeout(() => splash.remove(), 600);
        }
    }, 2000);

    loadHistory();
    updateUI();
});

/* ---------------- UI ---------------- */
function updateUI(){
    console.log("💰 Plan:", user.plan, "Credits:", user.credits);
}

/* ---------------- CREDIT SYSTEM ---------------- */
function canGenerate(){
    if(user.plan === "pro") return true;

    if(user.credits <= 0){
        alert("❌ Daily limit finished!");
        return false;
    }

    user.credits--;
    updateUI();
    return true;
}

/* ---------------- STYLE ---------------- */
function getStyleBoost(){
    switch(style.value){
        case "Realistic":
            return "ultra realistic DSLR photography, cinematic lighting, 8k";
        case "Anime":
            return "anime style, cinematic lighting, ultra detailed illustration";
        case "Cinematic":
            return "cinematic movie scene, dramatic lighting";
        default:
            return "high quality, ultra detailed";
    }
}

/* ---------------- PROMPT ---------------- */
function buildPrompt(text){
    return `${text}, ${getStyleBoost()}, ultra detailed, 4k, best quality`;
}

/* ================= SAFE AI CALL (NO CORS ISSUE) ================= */
async function generateImage(prompt){

    try {
        const res = await fetch("https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt));
        return res.url;
    } catch (err) {
        console.log(err);
        return null;
    }
}

/* ---------------- HISTORY ---------------- */
function saveHistory(url){
    let data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");
    data.unshift({ url });
    if(data.length > 50) data = data.slice(0,50);
    localStorage.setItem("sibghat_history", JSON.stringify(data));
}

function addToHistory(url){
    const img = document.createElement("img");
    img.src = url;
    img.onclick = () => {
        resultImage.src = url;
        resultImage.style.display = "block";
    };
    historyContainer.prepend(img);
}

function loadHistory(){
    const data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");
    data.forEach(item => addToHistory(item.url));
}

/* ---------------- LOADING ---------------- */
function setLoading(state){
    loading.style.display = state ? "block" : "none";
    generateBtn.disabled = state;
    generateBtn.innerText = state ? "Generating AI..." : "✨ Generate Image";
}

/* ---------------- MAIN ---------------- */
generateBtn.addEventListener("click", async () => {

    const text = promptInput.value.trim();

    if(!text){
        alert("Please enter a prompt!");
        return;
    }

    if(!canGenerate()) return;

    setLoading(true);

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(text);

    // SAFE WORKING IMAGE GENERATION
    const imageURL = await generateImage(finalPrompt);

    setLoading(false);

    if(!imageURL){
        alert("Image generation failed!");
        return;
    }

    resultImage.src = imageURL;
    resultImage.style.display = "block";

    downloadBtn.href = imageURL;
    downloadBtn.style.display = "inline-block";

    saveHistory(imageURL);
    addToHistory(imageURL);
});
