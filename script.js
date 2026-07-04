const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

/* ⚠️ PUT YOUR NEW REPLICATE TOKEN HERE */
const REPLICATE_API_TOKEN = "PASTE_YOUR_TOKEN_HERE";

/* ---------------- FREE STARTUP USER SYSTEM ---------------- */
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
            return "ultra realistic DSLR photography, cinematic lighting, 8k ultra detailed, sharp focus";
        case "Anime":
            return "anime style, studio ghibli inspired, cinematic lighting, ultra detailed illustration";
        case "Cinematic":
            return "movie scene, cinematic lighting, dramatic composition, film still, ultra realistic 8k";
        default:
            return "high quality, ultra detailed professional render";
    }
}

/* ---------------- PROMPT ENGINE ---------------- */
function buildPrompt(text){
    const styleBoost = getStyleBoost();
    return `${text}, ${styleBoost}, ultra detailed, best quality, 4k, sharp focus`;
}

/* ---------------- FLUX (REPLICATE) ENGINE ---------------- */
async function generateWithFLUX(prompt){

    const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            version: "black-forest-labs/flux-schnell",
            input: {
                prompt: prompt
            }
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
            output = data.output[0];
            break;
        }

        if(data.status === "failed"){
            return null;
        }

        await new Promise(r => setTimeout(r, 1500));
    }

    return output;
}

/* ---------------- HISTORY SYSTEM ---------------- */
function saveHistory(url){
    let data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");

    data.unshift({
        url,
        time: Date.now()
    });

    if(data.length > 50) data = data.slice(0,50);

    localStorage.setItem("sibghat_history", JSON.stringify(data));
}

function addToHistory(item){
    const img = document.createElement("img");
    img.src = item.url || item;

    img.onclick = () => {
        resultImage.src = img.src;
        resultImage.style.display = "block";
    };

    historyContainer.prepend(img);
}

function loadHistory(){
    const data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");

    data.forEach(item => {
        if(typeof item === "string") addToHistory(item);
        else addToHistory(item.url);
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

    const userText = promptInput.value.trim();

    if(!userText){
        alert("⚠ Please enter a prompt!");
        return;
    }

    if(!canGenerate()){
        return;
    }

    setLoading(true);

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userText);

    let imageURL = await generateWithFLUX(finalPrompt);

    setLoading(false);

    if(!imageURL){
        alert("Image generation failed. Try again.");
        return;
    }

    resultImage.src = imageURL;
    resultImage.style.display = "block";

    downloadBtn.href = imageURL;
    downloadBtn.style.display = "inline-block";

    saveHistory(imageURL);
    addToHistory(imageURL);
});
