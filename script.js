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
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const appSection = document.getElementById("app");
const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

// Switch between login and signup
showSignup.addEventListener("click", e => {
  e.preventDefault();
  loginSection.style.display = "none";
  signupSection.style.display = "block";
});
showLogin.addEventListener("click", e => {
  e.preventDefault();
  signupSection.style.display = "none";
  loginSection.style.display = "block";
});

// Signup logic with auto-login
signupForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const newUsername = document.getElementById("newUsername").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  if (!newUsername || newPassword.length < 6) {
    signupMessage.textContent = "❌ Username required & password must be 6+ chars.";
    signupMessage.className = "error";
    return;
  }

  const userData = { username: newUsername, password: newPassword };
  localStorage.setItem("sibghat_user", JSON.stringify(userData));

  signupMessage.textContent = "✅ Signup successful! Logged in automatically.";
  signupMessage.className = "success";
  signupSection.style.display = "none";
  appSection.style.display = "flex";
});

// Login logic
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const savedUser = JSON.parse(localStorage.getItem("sibghat_user"));

  if (savedUser && username === savedUser.username && password === savedUser.password) {
    loginMessage.textContent = "✅ Login successful!";
    loginMessage.className = "success";
    loginSection.style.display = "none";
    appSection.style.display = "flex";
  } else {
    loginMessage.textContent = "❌ Invalid credentials!";
    loginMessage.className = "error";
  }
});

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

/* ================= IMAGE GENERATION ================= */
function setPrompt(text) {
  promptInput.value = text;
}

// Build prompt with style/category
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

// Generate image (direct URL)
function generateImage(prompt) {
  return "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt.trim());
}

generateBtn.addEventListener("click", async () => {
  let text = promptInput.value.trim();
  if (!text) {
    alert("Please enter a prompt!");
    return;
  }

  loading.classList.remove("hidden");
  resultImage.style.display = "none";
  resultImage.style.opacity = "0";
  downloadBtn.style.display = "none";

  const finalPrompt = buildPrompt(text);
  const imageURL = generateImage(finalPrompt);

  // Hide loading
  loading.classList.add("hidden");

  // Show image with fade-in
  resultImage.src = imageURL;
  resultImage.style.display = "block";
  setTimeout(() => {
    resultImage.style.opacity = "1";
    resultImage.style.transform = "scale(1)";
  }, 100); // small delay for transition

  // Show download button
  downloadBtn.href = imageURL;
  downloadBtn.style.display = "inline-block";
});

/* ================= HISTORY ================= */
clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("sibghat_history");
  historyContainer.innerHTML = "";
});
