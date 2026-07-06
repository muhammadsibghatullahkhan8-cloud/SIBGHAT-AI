/* ================= ELEMENTS ================= */
const promptInput = document.getElementById("prompt");
const style = document.getElementById("style");
const category = document.getElementById("category");
const theme = document.getElementById("theme");
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
    document.getElementById("login-section").style.display = "none";
    document.getElementById("signup-section").style.display = "none";
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

/* ================= GEMINI API INTEGRATION ================= */
const GEMINI_API_KEY = "AQ.Ab8RN6Lw3M45ioeB2ijLXwF4gqdiKrhmWZDAcS3fJ0rd5Be7tg"; // apna naya key yahan daalo

function setPrompt(text) {
  promptInput.value = text;
}

function buildPrompt(text) {
  let styleBoost = "";
  if (style.value === "Realistic") styleBoost = "ultra realistic DSLR photography, cinematic lighting, 8k";
  else if (style.value === "Anime") styleBoost = "anime style, ultra detailed illustration";
  else if (style.value === "Cinematic") styleBoost = "cinematic movie scene, dramatic lighting";
  else styleBoost = "high quality, ultra detailed";

  let categoryBoost = "";
  if (category.value === "car") categoryBoost = "luxury sports car, automotive photography";
  else if (category.value === "space") categoryBoost = "outer space, galaxies, sci-fi scene";
  else if (category.value === "natural") categoryBoost = "beautiful nature, mountains, forest, river";
  else if (category.value === "city") categoryBoost = "futuristic city, neon lights, cyberpunk";
  else if (category.value === "anime") categoryBoost = "anime style illustration";

  return `${text}, ${styleBoost}, ${categoryBoost}, ultra detailed, realistic lighting, 8k, sharp focus, no watermark, no text`;
}

async function generateImage(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/nanobanana-2-lite:generateImage?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: { text: prompt }
      })
    }
  );

  const data = await response.json();
  console.log(data); // Debugging ke liye response check karo

  if (!data.imageUrl) {
    throw new Error("❌ No image returned. Try another model or prompt.");
  }
  return data.imageUrl;
}

/* ================= GENERATE BUTTON ================= */
generateBtn.addEventListener("click", async () => {
  let text = promptInput.value.trim();
  if (!text) {
    alert("Please enter a prompt!");
    return;
  }

  loading.classList.remove("hidden");
  resultImage.style.display = "none";
  downloadBtn.style.display = "none";

  const finalPrompt = buildPrompt(text);

  try {
    const imageURL = await generateImage(finalPrompt);

    resultImage.onload = () => {
      loading.classList.add("hidden");
      resultImage.style.display = "block";
      downloadBtn.href = imageURL;
      downloadBtn.style.display = "inline-block";
    };

    resultImage.src = imageURL;
  } catch (error) {
    loading.classList.add("hidden");
    alert(error.message);
  }
});

/* ================= CLEAR HISTORY ================= */
clearHistoryBtn.addEventListener("click", () => {
  historyContainer.innerHTML = "";
});
