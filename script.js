const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");

function buildPrompt(userPrompt) {
    let finalPrompt = userPrompt;

    if (style.value !== "") {
        finalPrompt += ", " + style.value;
    }

    // 🚀 STRONG QUALITY BOOST (VERY IMPORTANT)
    finalPrompt += ", ultra realistic, 8k, highly detailed, sharp focus, cinematic lighting, professional photography, masterpiece";

    return finalPrompt;
}

function generateImageURL(prompt) {
    return "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(prompt) +
        "?width=1024&height=1024&model=flux&seed=" + Date.now();
}

async function tryGenerate(prompt, retries = 2) {

    for (let i = 0; i <= retries; i++) {

        const url = generateImageURL(prompt);

        const img = new Image();

        const success = await new Promise((resolve) => {

            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);

            img.src = url;

            // timeout safety
            setTimeout(() => resolve(false), 8000);
        });

        if (success) return url;
    }

    return null;
}

generateBtn.addEventListener("click", async () => {

    const userPrompt = promptInput.value.trim();

    if (!userPrompt) {
        alert("Please enter a prompt.");
        return;
    }

    loading.style.display = "block";
    resultImage.style.display = "none";
    downloadBtn.style.display = "none";

    const finalPrompt = buildPrompt(userPrompt);

    const imageURL = await tryGenerate(finalPrompt);

    loading.style.display = "none";

    if (imageURL) {
        resultImage.src = imageURL;
        resultImage.style.display = "block";

        downloadBtn.href = imageURL;
        downloadBtn.style.display = "inline-block";
    } else {
        alert("AI failed to generate image. Try again.");
    }
});
