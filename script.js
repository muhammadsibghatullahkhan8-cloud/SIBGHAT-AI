
const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

/* ---------------- INIT ---------------- */
window.addEventListener("load", () => {

    // splash screen
    const splash = document.getElementById("splash-screen");
    setTimeout(() => {
        if (splash) {
            splash.style.opacity = "0";
            setTimeout(() => splash.remove(), 600);
        }
    }, 2000);

    // load history
    loadHistory();
});

/* ---------------- PROMPT ---------------- */
function setPrompt(text){
    promptInput.value = text;
}

/* ---------------- CLEAR HISTORY ---------------- */
function clearHistory(){
    localStorage.removeItem("sibghat_history");
    if(historyContainer) historyContainer.innerHTML = "";
}

/* ---------------- PROMPT ENGINE ---------------- */
function buildPrompt(userPrompt){
    return userPrompt +
    (style.value ? ", " + style.value : "") +
    ", ultra realistic, 8k, highly detailed, cinematic lighting, sharp focus, masterpiece, professional photography";
}

/* ---------------- IMAGE API ---------------- */
function generateImageURL(prompt){
    return "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(prompt) +
        "?width=1024&height=1024&model=flux&seed=" + Date.now();
}

/* ---------------- SAFE GENERATION ---------------- */
async function tryGenerate(prompt){

    const url = generateImageURL(prompt);
    const img = new Image();

    const success = await new Promise((resolve) => {

        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);

        img.src = url;

        setTimeout(() => resolve(false), 8000);
    });

    return success ? url : null;
}

/* ---------------- HISTORY SAVE ---------------- */
function saveHistory(url){
    let data = JSON.parse(localStorage.getItem("sibghat_history") || "[]");

    data.unshift(url);

    if(data.length > 20) data.pop();

    localStorage.setItem("sibghat_history", JSON.stringify(data));
}

/* ---------------- HISTORY UI ---------------- */
function addToHistory(url){

    const img = document.createElement("img");
    img.src = url;

    img.onclick = () => {
        resultImage.src = url;
        resultImage.classList.add("show");
    };

    historyContainer.prepend(img);
}

/* ---------------- LOAD HISTORY ---------------- */
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
    generateBtn.innerText = "Generating...";
    loading.style.display = "block";

    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userPrompt);

    const imageURL = await tryGenerate(finalPrompt);

    // UI RESET
    generateBtn.disabled = false;
    generateBtn.innerText = "✨ Generate Image";
    loading.style.display = "none";

    if(imageURL){

        resultImage.src = imageURL;
        resultImage.style.display = "block";

        setTimeout(() => {
            resultImage.classList.add("show");
        }, 50);

        downloadBtn.href = imageURL;
        downloadBtn.style.display = "inline-block";

        saveHistory(imageURL);
        addToHistory(imageURL);

    } else {
        alert("Image generation failed. Try again.");
    }
});
