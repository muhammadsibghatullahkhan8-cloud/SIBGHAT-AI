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

/* ---------------- CLEAR HISTORY ---------------- */
function clearHistory(){
    localStorage.removeItem("sibghat_history");
    historyContainer.innerHTML = "";
}

/* ---------------- STYLE ENGINE (PRO) ---------------- */
function getStyleBoost(){
    switch(style.value){
        case "Realistic":
            return "ultra realistic DSLR photo, natural lighting, 8k, ultra sharp details";
        case "Anime":
            return "anime illustration, studio ghibli inspired, highly detailed, cinematic anime lighting";
        case "Cinematic":
            return "cinematic movie scene, dramatic lighting, film still, ultra detailed 8k";
        default:
            return "high quality, ultra detailed, professional photography";
    }
}

/* ---------------- PROMPT ENGINE ---------------- */
function buildPrompt(text){

    const base = text.trim();
    const styleBoost = getStyleBoost();

    return `
${base},
${styleBoost},
professional composition, masterpiece, best quality, ultra detailed, sharp focus
`.replace(/\s+/g, " ").trim();
}

/* ---------------- AI CALL ---------------- */
async function generateWithDeepAI(prompt){

    try {
        const res = await fetch("https://api.deepai.org/api/text2img", {
            method: "POST",
            headers: { "Api-Key": DEEPAI_KEY },
            body: new URLSearchParams({ text: prompt })
        });

        const data = await res.json();

        if (data.output_url) return data.output_url;

        return null;

    } catch (err) {
        console.log("AI Error:", err);
        return null;
    }
}

/* ---------------- HISTORY ---------------- */
function saveHistory(url){
    let data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");

    data.unshift(url);

    if(data.length > 25) data = data.slice(0,25);

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

/* ---------------- MAIN GENERATE ---------------- */
generateBtn.addEventListener("click", async () => {

    const userText = promptInput.value.trim();

    if(!userText){
        alert("⚠ Please enter a prompt first!");
        return;
    }

    // UI LOCK
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";
    loading.style.display = "block";

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userText);

    let imageURL = await generateWithDeepAI(finalPrompt);

    if(!imageURL){
        imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?t=${Date.now()}`;
    }

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
