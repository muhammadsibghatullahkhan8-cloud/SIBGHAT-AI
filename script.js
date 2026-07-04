const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

/* ---------------- DEEPAI KEY ---------------- */
const DEEPAI_KEY = "e56a67d0-84d7-435f-a0c9-64b1779df06c";

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
});

/* ---------------- PROMPT ---------------- */
function setPrompt(text){
    promptInput.value = text;
}

function clearHistory(){
    localStorage.removeItem("sibghat_history");
    historyContainer.innerHTML = "";
}

/* ---------------- PROMPT ENGINE (UPDATED PRO VERSION) ---------------- */
function buildPrompt(userPrompt){

    let styleBoost = "";

    if(style.value === "Realistic"){
        styleBoost = "ultra realistic DSLR photo, natural lighting, 8k detail";
    }
    else if(style.value === "Anime"){
        styleBoost = "anime style, studio ghibli quality, highly detailed illustration";
    }
    else if(style.value === "Cinematic"){
        styleBoost = "cinematic lighting, movie scene, dramatic composition, 8k";
    }
    else{
        styleBoost = "high quality, ultra detailed";
    }

    return `
${userPrompt},
${styleBoost},
sharp focus, professional composition, masterpiece, best quality
`.trim();
}

/* ---------------- DEEPAI AI ---------------- */
async function generateWithDeepAI(prompt){

    try {
        const response = await fetch("https://api.deepai.org/api/text2img", {
            method: "POST",
            headers: {
                "Api-Key": DEEPAI_KEY
            },
            body: new URLSearchParams({
                text: prompt
            })
        });

        const data = await response.json();

        if (data.output_url) {
            return data.output_url;
        }

        return null;

    } catch (err) {
        console.log("DeepAI Error:", err);
        return null;
    }
}

/* ---------------- HISTORY ---------------- */
function saveHistory(url){
    let data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");
    data.unshift(url);
    if(data.length > 20) data.pop();
    localStorage.setItem("sibghat_history", JSON.stringify(data));
}

function addToHistory(url){
    const img = document.createElement("img");
    img.src = url;

    img.onclick = () => {
        resultImage.src = url;
        resultImage.classList.add("show");
    };

    historyContainer.prepend(img);
}

function loadHistory(){
    const data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");
    data.forEach(url => addToHistory(url));
}

/* ---------------- MAIN BUTTON ---------------- */
generateBtn.addEventListener("click", async () => {

    const userPrompt = promptInput.value.trim();

    if (!userPrompt) {
        alert("Please enter a prompt!");
        return;
    }

    // UI LOCK
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating AI...";
    loading.style.display = "block";

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userPrompt);

    /* ---------------- AI CALL ---------------- */
    let imageURL = await generateWithDeepAI(finalPrompt);

    // fallback (agar DeepAI fail ho jaye)
    if (!imageURL) {
        imageURL = "https://image.pollinations.ai/prompt/" +
            encodeURIComponent(finalPrompt) +
            "?width=1024&height=1024&model=flux&seed=" + Date.now();
    }

    // UI RESET
    generateBtn.disabled = false;
    generateBtn.innerText = "✨ Generate Image";
    loading.style.display = "none";

    resultImage.src = imageURL;
    resultImage.style.display = "block";

    setTimeout(() => {
        resultImage.classList.add("show");
    }, 50);

    downloadBtn.href = imageURL;
    downloadBtn.style.display = "inline-block";

    saveHistory(imageURL);
    addToHistory(imageURL);
});
