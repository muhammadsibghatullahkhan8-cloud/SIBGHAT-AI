const prompt = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");

generateBtn.addEventListener("click", () => {

    const text = prompt.value.trim();

    if (text === "") {
        alert("Please enter a prompt.");
        return;
    }

    loading.classList.remove("hidden");
    resultImage.style.display = "none";
    downloadBtn.classList.add("hidden");

    const imageURL = "https://image.pollinations.ai/prompt/" + encodeURIComponent(text);

    resultImage.onload = () => {
        loading.classList.add("hidden");
        resultImage.style.display = "block";
        downloadBtn.href = imageURL;
        downloadBtn.classList.remove("hidden");
    };

    resultImage.onerror = () => {
        loading.classList.add("hidden");
        alert("Image generation failed. Please try again.");
    };

    resultImage.src = imageURL + "?t=" + Date.now();

});
