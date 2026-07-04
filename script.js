const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");

generateBtn.addEventListener("click", async () => {

    const userPrompt = promptInput.value.trim();

    if (userPrompt === "") {
        alert("Please enter a prompt.");
        return;
    }

    // UI state
    loading.style.display = "block";
    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    // Enhance prompt (PRO level)
    let finalPrompt = userPrompt;

    if (style.value !== "") {
        finalPrompt += ", " + style.value;
    }

    finalPrompt += ", ultra realistic, highly detailed, 8k, cinematic lighting, masterpiece";

    // Safe image API (Pollinations)
    const imageURL =
        "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(finalPrompt) +
        "?width=1024&height=1024&seed=" + Date.now();

    // preload image (better UX)
    const img = new Image();

    img.onload = function () {
        resultImage.src = imageURL;

        loading.style.display = "none";
        resultImage.style.display = "block";

        downloadBtn.href = imageURL;
        downloadBtn.style.display = "inline-block";
    };

    img.onerror = function () {
        loading.style.display = "none";
        alert("Image generation failed. Try again.");
    };

    img.src = imageURL;
});
