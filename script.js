/* ================= ELEMENTS ================= */
const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const category = document.getElementById("category");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");
const historyContainer = document.getElementById("history");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

/* ================= IMAGE GENERATION ================= */
async function generateImage() {
    let text = promptInput.value.trim();
    if (!text) {
        alert("Please enter a prompt!");
        return;
    }

    // UI Updates
    loading.classList.remove("hidden");
    resultImage.style.display = "none";
    downloadBtn.classList.add("hidden");

    // Prompt building
    const styleBoost = style.value !== "Default" ? style.value : "";
    const fullPrompt = `${text}, ${styleBoost}, ${category.value}`.replace(/,/g, " ");
    
    // Pollinations AI URL (Image Generation)
    const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=800&height=600&nologo=true`;

    // Load Image
    resultImage.onload = () => {
        loading.classList.add("hidden");
        resultImage.style.display = "block";
        downloadBtn.href = imageURL;
        downloadBtn.classList.remove("hidden");

        // History thumbnail
        const thumb = document.createElement("img");
        thumb.src = imageURL;
        thumb.className = "thumb";
        historyContainer.appendChild(thumb);
    };

    resultImage.onerror = () => {
        loading.classList.add("hidden");
        alert("Image generate karne mein error aaya. Try again!");
    };

    resultImage.src = imageURL;
}

generateBtn.addEventListener("click", generateImage);
clearHistoryBtn.addEventListener("click", () => historyContainer.innerHTML = "");

// Owner Access & Splash logic wahi rahegi jo aapki pehle thi
