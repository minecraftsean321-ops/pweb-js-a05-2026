const profileIcon = document.getElementById("profile-icon");
const profilePanel = document.getElementById("profile-panel");
const welcomeElement = document.getElementById("welcome-user");
const logoutBtn = document.getElementById("logout-btn");

// Tampilkan nama pengguna
const firstName = localStorage.getItem("firstName");
welcomeElement.textContent = `Selamat datang, ${firstName || "Pengguna"}`;

// Klik ikon profil -> toggle panel
profileIcon.addEventListener("click", () => {
    profilePanel.classList.toggle("hidden");
});

// Tombol logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("firstName");
    window.location.href = "login.html";
});

