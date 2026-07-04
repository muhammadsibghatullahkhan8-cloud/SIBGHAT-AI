const prompt = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");

generateBtn.addEventListener("click", () => {

    const userPrompt = prompt.value.trim();

    if (userPrompt === "") {
        alert("Please enter a prompt.");
        return;
    }

    // Show Loading
    loading.classList.remove("hidden");
    resultImage.style.display = "none";
    downloadBtn.classList.add("hidden");

    // Prompt + Style + Quality Enhancement
    let finalPrompt = userPrompt;

    if (style.value !== "") {
        finalPrompt += ", " + style.value;
    }

    finalPrompt += ", masterpiece, best quality, ultra detailed, 8k, sharp focus, cinematic lighting";

    // Generate Image URL
    const imageURL =
        "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(finalPrompt) +
        "?t=" + Date.now();

    // Success
    resultImage.onload = () => {
        loading.classList.add("hidden");
        resultImage.style.display = "block";
        downloadBtn.href = imageURL;
        downloadBtn.classList.remove("hidden");
    };

    // Error
    resultImage.onerror = () => {
        loading.classList.add("hidden");
        alert("Failed to generate image. Please try again.");
    };

    // Load Image
    resultImage.src = imageURL;

});
