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

/* ================= OWNER ACCESS ================= */
function ownerAccess(code) {
  const ownerCode = "*283141#";
  if (code === ownerCode) {
    alert("✅ Owner access granted!");
    document.getElementById("owner-section").style.display = "none";
    document.getElementById("app").style.display = "flex";
  } else {
    alert("❌ Invalid owner code!");
  }
}

/* ================= SPLASH SCREEN ================= */
window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  setTimeout(() => {
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 600);
  }, 2000);
});

/* ================= IMAGE GENERATION (Unsplash) ================= */
function setPrompt(text) {
  promptInput.value = text;
}

function buildPrompt(text) {
  let styleBoost = "";
  if (style.value === "Realistic") styleBoost = "realistic";
  else if (style.value === "Anime") styleBoost = "anime";
  else if (style.value === "Cinematic") styleBoost = "cinematic";

  let categoryBoost = category.value ? category.value : "";

  return `${text} ${styleBoost} ${categoryBoost}`;
}

async function generateImage() {
  let text = promptInput.value.trim();
  if (!text) {
    alert("Please enter a prompt!");
    return;
  }

  loading.classList.remove("hidden");
  resultImage.style.display = "none";
  downloadBtn.style.display = "none";

  const finalPrompt = buildPrompt(text);

  // Direct Unsplash image URL
  const imageURL = `https://source.unsplash.com/800x600/?${encodeURIComponent(finalPrompt)}`;

  resultImage.onload = () => {
    loading.classList.add("hidden");
    resultImage.style.display = "block";
    downloadBtn.href = imageURL;
    downloadBtn.download = "sibghat_ai_image.jpg";
    downloadBtn.style.display = "inline-block";

    const thumb = document.createElement("img");
    thumb.src = imageURL;
    thumb.className = "thumb";
    historyContainer.appendChild(thumb);
  };

  resultImage.src = imageURL;
}

/* ================= GENERATE BUTTON ================= */
generateBtn.addEventListener("click", generateImage);

/* ================= CLEAR HISTORY ================= */
clearHistoryBtn.addEventListener("click", () => {
  historyContainer.innerHTML = "";
});
