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

/* ---------------- SMART PROMPT CLEANER ---------------- */
function cleanPrompt(text){
    return text
        .replace(/\s+/g, " ")
        .replace(/a photo of|image of|picture of/gi, "")
        .trim();
}

/* ---------------- STYLE ENGINE (ULTRA PRO) ---------------- */
function getStyleBoost(){
    const value = style.value;

    const styles = {
        Realistic: "ultra realistic DSLR photography, 8k, natural lighting, sharp focus, professional color grading",
        Anime: "anime style, studio ghibli quality, cinematic anime lighting, ultra detailed illustration",
        Cinematic: "movie scene, cinematic lighting, dramatic composition, film still, ultra realistic 8k"
    };

    return styles[value] || "high quality, ultra detailed professional render";
}

/* ---------------- QUALITY BOOST ---------------- */
function getQualityBoost(){
    return "masterpiece, best quality, ultra detailed, sharp focus, 4k, high resolution";
}

/* ---------------- PROMPT ENGINE ---------------- */
function buildPrompt(text){
    const clean = cleanPrompt(text);
    const styleBoost = getStyleBoost();
    const quality = getQualityBoost();

    return `${clean}, ${styleBoost}, ${quality}`;
}

/* ---------------- AI CALL (ULTRA SAFE + RETRY) ---------------- */
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

        if (retry > 0) {
            return await generateWithDeepAI(prompt, retry - 1);
        }

        return null;

    } catch (err) {
        console.log("AI Error:", err);

        if (retry > 0) {
            return await generateWithDeepAI(prompt, retry - 1);
        }

        return null;
    }
}

/* ---------------- HISTORY SYSTEM ---------------- */
function saveHistory(url){
    let data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");

    data.unshift(url);

    if(data.length > 40) data = data.slice(0,40);

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

/* ---------------- MAIN ENGINE ---------------- */
generateBtn.addEventListener("click", async () => {

    const userText = promptInput.value.trim();

    if(!userText){
        alert("⚠ Please enter a prompt!");
        return;
    }

    // UI LOCK
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating Ultra AI...";
    loading.style.display = "block";

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userText);

    let imageURL = await generateWithDeepAI(finalPrompt);

    // fallback system
    if(!imageURL){
        imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?t=${Date.now()}`;
    }

    // UI RESET
    loading.style.display = "none";
    generateBtn.disabled = false;
    generateBtn.innerText = "✨ Generate Ultra Image";

    resultImage.src = imageURL;
    resultImage.style.display = "block";

    setTimeout(() => resultImage.classList.add("show"), 50);

    downloadBtn.href = imageURL;
    downloadBtn.style.display = "inline-block";

    saveHistory(imageURL);
    addToHistory(imageURL);
});
