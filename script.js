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

/* ================= LOGIN & SIGNUP SYSTEM ================= */
// (same as your existing login/signup code)

/* ================= OWNER ACCESS ================= */
function ownerAccess(code) {
  const ownerCode = "*283141#";
  if (code === ownerCode) {
    alert("✅ Owner access granted!");
    loginSection.style.display = "none";
    signupSection.style.display = "none";
    appSection.style.display = "flex";
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
const GEMINI_API_KEY = "AQ.Ab8RN6Lw3M45ioeB2ijLXwF4gqdiKrhmWZDAcS3fJ0rd5Be7tg";

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

  return `professional photo, ${text}, ${styleBoost}, ${categoryBoost}, ultra detailed, realistic lighting, 8k, sharp focus, no watermark, no text`;
}

async function generateImage(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  try {
    return data.candidates[0].content.parts[0].imageUrl;
  } catch (err) {
    throw new Error("Image generation failed");
  }
}

generateBtn.addEventListener("click", async () => {
  let text = promptInput.value.trim();
  if (!text) {
    alert("Please enter a prompt!");
    return;
  }

  loading.classList
