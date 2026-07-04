const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

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

/* ---------------- STYLE BOOST (PRO LEVEL) ---------------- */
function getStyleBoost(){
    switch(style.value){
        case "Realistic":
            return "ultra realistic DSLR photo, cinematic lighting, 8k, sharp focus, professional photography";
        case "Anime":
            return "anime style, studio ghibli quality, ultra detailed illustration, cinematic anime lighting";
        case "Cinematic":
            return "cinematic movie scene, dramatic lighting, film still, ultra realistic 8k";
        default:
            return "high quality, ultra detailed, professional render";
    }
}

/* ---------------- NEGATIVE PROMPT (IMPORTANT PRO FEATURE) ---------------- */
function getNegativePrompt(){
    return "blurry, low quality, distorted, watermark, text, extra limbs, bad anatomy, noisy";
}

/* ---------------- PROMPT ENGINE (SMART AI BOOST) ---------------- */
function buildPrompt(text){

    const cleanText = text.trim();
    const styleBoost = getStyleBoost();
    const negative = getNegativePrompt();

    return `
${cleanText},
${styleBoost},
masterpiece, best quality, ultra detailed, sharp focus, 4k, professional composition
`.replace(/\s+/g, " ").trim() +
` --no ${negative}`;
}

/* ---------------- AI CALL (WITH RETRY SYSTEM) ---------------- */
async function generateWithDeepAI(prompt, retry = 1){

    try {
        const res = await fetch("https://api.deepai.org/api/text2img", {
            method: "POST",
            headers: { "Api-Key": DEEPAI_KEY },
            body: new URLSearchParams({ text: prompt })
        });

        const data = await res.json();

        if (data.output_url) return data.output_url;

        if (retry > 0) {
            console.log("Retrying AI...");
            return await generateWithDeepAI(prompt, retry - 1);
        }

        return null;

    } catch (err) {
        console.log("AI Error:", err);
        return null;
    }
}

/* ---------------- WATERMARK (PRO FEATURE IDEA) ---------------- */
function addWatermark(url){
    // simple trick: append timestamp to force unique + avoid cache issues
    return url + "&wm=sibghat_ai";
}

/* ---------------- HISTORY ---------------- */
function saveHistory(url){
    let data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");

    data.unshift(url);

    if(data.length > 30) data = data.slice(0,30);

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
    data.forEach(addToHistory);
}

/* ---------------- MAIN GENERATE (PRO FLOW) ---------------- */
generateBtn.addEventListener("click", async () => {

    const userText = promptInput.value.trim();

    if(!userText){
        alert("⚠ Enter a prompt first!");
        return;
    }

    // UI LOCK
    generateBtn.disabled = true;
    generateBtn.innerText = "AI Thinking...";
    loading.style.display = "block";

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userText);

    let imageURL = await generateWithDeepAI(finalPrompt);

    // fallback system
    if(!imageURL){
        imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?seed=${Date.now()}`;
    }

    // watermark apply (logic level)
    imageURL = addWatermark(imageURL);

    // UI RESET
    loading.style.display = "none";
    generateBtn.disabled = false;
    generateBtn.innerText = "✨ Generate Image";

    resultImage.src = imageURL;
    resultImage.style.display = "block";

    setTimeout(() => resultImage.classList.add("show"), 50);

    downloadBtn.href = imageURL;
    downloadBtn.style.display = "inline-block";

    saveHistory(imageURL);
    addToHistory(imageURL);
});
