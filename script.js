const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

const DEEPAI_KEY = "e56a67d0-84d7-435f-a0c9-64b1779df06c";

/* ---------------- MONEY SYSTEM ---------------- */
let user = {
    plan: "free",
    credits: 5
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

/* ---------------- UI UPDATE ---------------- */
function updateUI(){
    console.log("💰 Credits:", user.credits, "Plan:", user.plan);
}

/* ---------------- CREDIT SYSTEM ---------------- */
function useCredit(){

    if(user.plan === "pro"){
        return true; // unlimited
    }

    if(user.credits <= 0){
        alert("❌ No credits left! Upgrade to Pro to continue.");
        return false;
    }

    user.credits--;
    updateUI();
    return true;
}

/* ---------------- CLEAN PROMPT ---------------- */
function cleanPrompt(text){
    return text
        .replace(/\s+/g, " ")
        .replace(/make|create|generate|draw/gi, "")
        .trim();
}

/* ---------------- STYLE ENGINE ---------------- */
function getStyleBoost(){
    switch(style.value){
        case "Realistic":
            return "ultra realistic DSLR photography, cinematic lighting, 8k, sharp focus, professional color grading";
        case "Anime":
            return "anime style, studio ghibli quality, ultra detailed illustration, cinematic anime lighting";
        case "Cinematic":
            return "movie scene, cinematic lighting, dramatic composition, film still, ultra realistic 8k";
        default:
            return "high quality, ultra detailed professional render";
    }
}

/* ---------------- QUALITY BOOST ---------------- */
function getQualityBoost(){
    return "masterpiece, best quality, ultra detailed, sharp focus, 4k resolution, professional composition";
}

/* ---------------- PROMPT ENGINE ---------------- */
function buildPrompt(text){
    const clean = cleanPrompt(text);
    const styleBoost = getStyleBoost();
    const quality = getQualityBoost();

    return `${clean}, ${styleBoost}, ${quality}`;
}

/* ---------------- AI ENGINE ---------------- */
async function generateWithDeepAI(prompt, retry = 2){

    try {
        const res = await fetch("https://api.deepai.org/api/text2img", {
            method: "POST",
            headers: {
                "Api-Key": DEEPAI_KEY
            },
            body: new URLSearchParams({ text: prompt })
        });

        const data = await res.json();

        if (data.output_url) return data.output_url;

        if (retry > 0) return await generateWithDeepAI(prompt, retry - 1);

        return null;

    } catch (err) {
        console.log(err);
        if (retry > 0) return await generateWithDeepAI(prompt, retry - 1);
        return null;
    }
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

/* ---------------- LOADING UI ---------------- */
function setLoading(state){
    if(state){
        loading.style.display = "block";
        generateBtn.disabled = true;
        generateBtn.innerText = "AI Processing...";
    } else {
        loading.style.display = "none";
        generateBtn.disabled = false;
        generateBtn.innerText = "✨ Generate Image";
    }
}

/* ---------------- MAIN SYSTEM (MONEY CHECK) ---------------- */
generateBtn.addEventListener("click", async () => {

    const userText = promptInput.value.trim();

    if(!userText){
        alert("⚠ Please enter a prompt!");
        return;
    }

    // 💰 CREDIT CHECK FIRST
    if(!useCredit()){
        return;
    }

    setLoading(true);

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userText);

    let imageURL = await generateWithDeepAI(finalPrompt);

    if(!imageURL){
        imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?t=${Date.now()}`;
    }

    setLoading(false);

    resultImage.src = imageURL;
    resultImage.style.display = "block";

    setTimeout(() => resultImage.classList.add("show"), 50);

    downloadBtn.href = imageURL;
    downloadBtn.style.display = "inline-block";

    saveHistory(imageURL);
    addToHistory(imageURL);
});
