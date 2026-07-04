
const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");

/* ---------------- SPLASH SCREEN ---------------- */
window.addEventListener("load", () => {
    setTimeout(() => {
        const splash = document.getElementById("splash-screen");
        if (splash) {
            splash.style.opacity = "0";
            splash.style.transition = "0.6s";
            setTimeout(() => splash.remove(), 600);
        }
    }, 2000);
});

/* ---------------- PROMPT SUGGESTION ---------------- */
function setPrompt(text) {
    promptInput.value = text;
}

/* ---------------- PROMPT BUILDER ---------------- */
function buildPrompt(userPrompt) {
    let finalPrompt = userPrompt;

    if (style.value !== "") {
        finalPrompt += ", " + style.value;
    }

    finalPrompt += ", ultra realistic, 8k, highly detailed, sharp focus, cinematic lighting, professional photography, masterpiece";

    return finalPrompt;
}

/* ---------------- IMAGE URL ---------------- */
function generateImageURL(prompt) {
    return "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(prompt) +
        "?width=1024&height=1024&model=flux&seed=" + Date.now();
}

/* ---------------- SAFE GENERATION ---------------- */
async function tryGenerate(prompt, retries = 2) {

    for (let i = 0; i <= retries; i++) {

        const url = generateImageURL(prompt);

        const img = new Image();

        const success = await new Promise((resolve) => {

            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);

            img.src = url;

            setTimeout(() => resolve(false), 8000);
        });

        if (success) return url;
    }

    return null;
}

/* ---------------- MAIN BUTTON ---------------- */
generateBtn.addEventListener("click", async () => {

    const userPrompt = promptInput.value.trim();

    if (!userPrompt) {
        alert("Please enter a prompt.");
        return;
    }

    // LOCK UI
    generateBtn.disabled = true;
    generateBtn.innerText = "Thinking...";

    loading.style.display = "block";
    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userPrompt);

    const imageURL = await tryGenerate(finalPrompt);

    loading.style.display = "none";

    // RESET UI
    generateBtn.disabled = false;
    generateBtn.innerText = "✨ Generate Image";

    if (imageURL) {
        resultImage.src = imageURL;
        resultImage.style.display = "block";

        downloadBtn.href = imageURL;
        downloadBtn.style.display = "inline-block";

        /* ---------------- HISTORY ---------------- */
        if (historyContainer) {
            const img = document.createElement("img");
            img.src = imageURL;
            img.onclick = () => {
                resultImage.src = imageURL;
            };
            historyContainer.prepend(img);
        }

    } else {
        alert("AI failed to generate image. Try again.");
    }
});
