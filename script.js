
const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

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

/* ---------------- PROMPT ENGINE ---------------- */
function buildPrompt(userPrompt){
    return userPrompt +
    (style.value ? ", " + style.value : "") +
    ", ultra realistic, 8k, cinematic lighting, highly detailed, sharp focus, masterpiece";
}

/* ---------------- REAL AI (HUGGING FACE READY) ---------------- */
async function generateRealAI(prompt){

    const HF_TOKEN = "YOUR_HUGGINGFACE_TOKEN"; // <-- yahan apna token lagana

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + HF_TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: prompt
                })
            }
        );

        const blob = await response.blob();
        return URL.createObjectURL(blob);

    } catch (err) {
        console.log("AI Error:", err);
        return null;
    }
}

/* ---------------- FALLBACK (backup system) ---------------- */
function fallbackAI(prompt){
    return "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(prompt) +
        "?width=1024&height=1024&model=flux&seed=" + Date.now();
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

    if(!userPrompt){
        alert("Please enter a prompt!");
        return;
    }

    // UI LOCK
    generateBtn.disabled = true;
    generateBtn.innerText = "AI Thinking...";
    loading.style.display = "block";

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userPrompt);

    /* ---------------- TRY REAL AI ---------------- */
    let imageURL = await generateRealAI(finalPrompt);

    /* ---------------- IF FAIL → FALLBACK ---------------- */
    if(!imageURL){
        imageURL = fallbackAI(finalPrompt);
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
