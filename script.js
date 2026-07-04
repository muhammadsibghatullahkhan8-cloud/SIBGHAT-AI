const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const category = document.getElementById("category");
const theme = document.getElementById("theme");
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

/* ---------------- THEME ---------------- */
theme.addEventListener("change", () => {
    document.body.className = theme.value;
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
            return "anime style, ultra detailed illustration";
        case "Cinematic":
            return "cinematic movie scene, dramatic lighting";
        default:
            return "high quality, ultra detailed";
    }
}

/* ---------------- CATEGORY ---------------- */
function getCategoryBoost(){
    switch(category.value){
        case "car":
            return "luxury sports car, automotive photography";
        case "space":
            return "outer space, galaxies, sci-fi scene";
        case "natural":
            return "beautiful nature, mountains, forest, river";
        case "city":
            return "futuristic city, neon lights, cyberpunk";
        case "anime":
            return "anime style illustration";
        default:
            return "";
    }
}

/* ---------------- 🌍 MULTI LANGUAGE TRANSLATOR ---------------- */
async function translateToEnglish(text) {
    try {
        const res = await fetch(
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" +
            encodeURIComponent(text)
        );

        const data = await res.json();
        let translated = data[0][0][0];

        // FORCE CLEAN PROMPT STRUCTURE
        return "detailed professional image of: " + translated;

    } catch (e) {
        return "detailed professional image of: " + text;
    }
}

/* ---------------- PROMPT BUILDER ---------------- */
function buildPrompt(text){
    return `professional photo, ${text}, ${getStyleBoost()}, ${getCategoryBoost()}, ultra detailed, realistic lighting, 8k, sharp focus, no watermark, no text`;
}

/* ---------------- IMAGE GENERATION ---------------- */
async function generateImage(prompt){
    try {
        const res = await fetch(
            "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt.trim())
        );

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

    let text = promptInput.value.trim();

    if(!text){
        alert("Please enter a prompt!");
        return;
    }

    if(!canGenerate()) return;

    setLoading(true);

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    // 🌍 STEP 1: TRANSLATE ANY LANGUAGE → ENGLISH
    const englishText = await translateToEnglish(text);

    // 🎨 STEP 2: BUILD FINAL PROMPT
    const finalPrompt = buildPrompt(englishText);

    // 🖼 STEP 3: GENERATE IMAGE
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
