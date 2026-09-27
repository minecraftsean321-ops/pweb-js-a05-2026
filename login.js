// API yang digunakan untuk autentikasi
const API_URL = "https://dummyjson.com/users";

// Mengambil elemen dari HTML
const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");

const buttonText = document.getElementById("buttonText");

const loader = document.getElementById("loader");

const message = document.getElementById("message");

const togglePassword = document.getElementById("togglePassword");

// SHOW / HIDE PASSWORD

togglePassword.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";

    togglePassword.textContent = "Hide";
  } else {
    passwordInput.type = "password";

    togglePassword.textContent = "Show";
  }
});

// MENAMPILKAN PESAN

function showMessage(text, type) {
  message.textContent = text;

  message.className = "message " + type;
}

// LOADING STATE

function setLoading(isLoading) {
  loginButton.disabled = isLoading;

  if (isLoading) {
    buttonText.textContent = "Checking...";

    loginButton.classList.add("loading");

    loader.setAttribute("aria-hidden", "false");
  } else {
    buttonText.textContent = "Sign in";

    loginButton.classList.remove("loading");

    loader.setAttribute("aria-hidden", "true");
  }
}

// LOGIN FORM

loginForm.addEventListener("submit", async function (event) {
  // Mencegah form melakukan reload halaman
  event.preventDefault();

  // Mengambil input user
  const username = usernameInput.value.trim();

  const password = passwordInput.value;

  // VALIDASI INPUT

  if (!username || !password) {
    showMessage("Username dan password wajib diisi.", "error");

    return;
  }

  // Hapus pesan sebelumnya
  showMessage("", "");

  // Menampilkan loading
  setLoading(true);

  // FETCH USERS API

  try {
    const response = await fetch(API_URL);

    // Mengecek apakah request berhasil
    if (!response.ok) {
      throw new Error("Gagal mengambil data pengguna.");
    }

    // Mengubah response menjadi JSON
    const data = await response.json();

    // MENCARI USER

    const user = data.users.find(function (item) {
      return (
        item.username.toLowerCase() === username.toLowerCase() &&
        item.password === password
      );
    });

    // LOGIN GAGAL

    if (!user) {
      showMessage("Username atau password salah.", "error");

      return;
    }

    // LOGIN BERHASIL

    // Menyimpan firstName sesuai requirement
    localStorage.setItem("firstName", user.firstName);

    // Pesan berhasil
    showMessage(`Welcome, ${user.firstName}!`, "success");

    // REDIRECT KE KATALOG

    setTimeout(function () {
      window.location.href = "catalog.html";
    }, 500);
  } catch (error) {
    // Menampilkan error di console
    console.error("Login error:", error);

    // Menampilkan error ke user
    showMessage(
      "Tidak dapat terhubung ke server. Periksa koneksi internet lalu coba lagi.",
      "error",
    );
  } finally {
    // Menghentikan loading
    setLoading(false);
  }
});
