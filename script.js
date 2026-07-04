const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

/* ================= TOKEN ================= */
const REPLICATE_API_TOKEN = "r8_HSuzO0NoiLZPGdu4G6XG29dwcC2SXRE0gllHE";

/* ---------------- USER SYSTEM ---------------- */
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

    if(user.plan === "pro"){
        return true;
    }

    if(user.credits <= 0){
        alert("❌ Daily limit finished! Try again tomorrow or upgrade later.");
        return false;
    }

    user.credits--;
    updateUI();
    return true;
}

/* ---------------- STYLE ENGINE ---------------- */
function getStyleBoost(){
    switch(style.value){
        case "Realistic":
            return "ultra realistic DSLR photography, cinematic lighting, 8k, sharp focus";
        case "Anime":
            return "anime style, cinematic lighting, ultra detailed illustration";
        case "Cinematic":
            return "movie scene, cinematic lighting, dramatic composition, film still";
        default:
            return "high quality, ultra detailed professional render";
    }
}

/* ---------------- PROMPT ---------------- */
function buildPrompt(text){
    return `${text}, ${getStyleBoost()}, ultra detailed, best quality, 4k`;
}

/* ---------------- FLUX AI ---------------- */
async function generateWithFLUX(prompt){

    const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            version: "black-forest-labs/flux-schnell",
            input: { prompt }
        })
    });

    const prediction = await res.json();

    let output = null;

    while(!output){
        const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
            headers: {
                "Authorization": `Token ${REPLICATE_API_TOKEN}`
            }
        });

        const data = await poll.json();

        if(data.status === "succeeded"){
            output = Array.isArray(data.output) ? data.output[0] : data.output;
        }

        if(data.status === "failed"){
            return null;
        }

        await new Promise(r => setTimeout(r, 1500));
    }

    return output;
}

/* ---------------- HISTORY ---------------- */
function saveHistory(url){
    let data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");

    data.unshift({ url, time: Date.now() });

    if(data.length > 50) data = data.slice(0, 50);

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

    data.forEach(item => {
        addToHistory(item.url);
    });
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

    if(!canGenerate()){
        return;
    }

    setLoading(true);

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(text);

    let imageURL = await generateWithFLUX(finalPrompt);

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
