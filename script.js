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

/* ================= IMAGE GENERATION ================= */
async function generateImage() {
  let text = promptInput.value.trim();
  if (!text) {
    alert("Please enter a prompt!");
    return;
  }

  // UI Setup
  loading.classList.remove("hidden");
  resultImage.style.display = "none";
  downloadBtn.classList.add("hidden");

  // Prompt Construction
  const styleBoost = style.value !== "Default" ? style.value : "";
  const catBoost = category.value ? category.value : "";
  const fullPrompt = `${text} ${styleBoost} ${catBoost}`;

  // Pollinations API (More stable endpoint)
  const imageURL = `https://pollinations.ai/p/${encodeURIComponent(fullPrompt)}?width=800&height=600&seed=42&nologo=true`;

  console.log("Requesting URL:", imageURL);

  // Set the source
  resultImage.src = imageURL;

  // Handle Load Success
  resultImage.onload = () => {
    loading.classList.add("hidden");
    resultImage.style.display = "block";
    downloadBtn.href = imageURL;
    downloadBtn.classList.remove("hidden");

    // Add to history
    const thumb = document.createElement("img");
    thumb.src = imageURL;
    thumb.className = "thumb";
    thumb.onclick = () => { resultImage.src = imageURL; }; // Click thumb to show big
    historyContainer.appendChild(thumb);
  };

  // Handle Error
  resultImage.onerror = () => {
    loading.classList.add("hidden");
    alert("Error: Image load nahi ho saki. Server shayad busy hai.");
  };
}

/* ================= EVENT LISTENERS ================= */
generateBtn.addEventListener("click", generateImage);

clearHistoryBtn.addEventListener("click", () => {
  historyContainer.innerHTML = "";
});

function setPrompt(text) {
  promptInput.value = text;
}
