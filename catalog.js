const API_URL = 'https://dummyjson.com/products';
const catalog = document.getElementById('catalog');

//Untuk menyimpan data produk asli dari API
let allProducts = [];

// 1. Fungsi Fetch Data dari API
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    allProducts = data.products;
    
    // Render daftar produk menggunakan properti array 'products'
    renderProducts(data.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    catalog.innerHTML = `
      <p class="error-msg">Gagal memuat data produk. Silakan coba lagi nanti.</p>
    `;
  }
}

// 2. Fungsi Render Kartu Produk Ke DOM
function renderProducts(products) {
  // Reset isi container
  catalog.innerHTML = '';

  // Buat komponen kartu HTML untuk setiap item produk
  const cardsHTML = products.map((product) => {
    // Menghitung harga asli sebelum diskon (opsional)
    const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

    return `
      <div class="product-card" data-id="${product.id}">

        <div class="badge-discount">-${product.discountPercentage}%</div>
        <img src="${product.thumbnail}" alt="${product.title}" class="product-thumbnail" loading="lazy">
        
        <div class="product-body">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.title}</h3>
          
          <div class="product-meta">
            <span class="product-rating">⭐ ${product.rating}</span>
            <span class="product-stock">Stok: ${product.stock}</span>
          </div>

          <div class="product-price-box">
            <span class="current-price">$${product.price}</span>
            <span class="original-price">$${originalPrice}</span>
          </div>

          <button class="add-to-cart-btn" data-id="${product.id}">
            + Tambah ke Keranjang
          </button>

        </div>

      </div>
    `;
  }).join('');

  // Masukkan elemen HTML sekaligus ke dalam DOM
  catalog.innerHTML = cardsHTML;
}

// Fungsi Debounce (Menggunakan Closure)
function createDebounce(func, delay = 300) {
  let timeoutId; // Disimpan dalam Closure

  return function (...args) {
    // Batalkan timer sebelumnya jika pengguna masih mengetik
    clearTimeout(timeoutId);

    // Set timer baru
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Fungsi Logika Pencarian (Filter Berdasarkan Nama atau Kategori)
function handleSearch(event) {
  const keyword = event.target.value.toLowerCase().trim();

  // Filter produk berdasarkan judul (title) atau kategori (category)
  const filteredProducts = allProducts.filter(product => {
    const matchTitle = product.title.toLowerCase().includes(keyword);
    const matchCategory = product.category.toLowerCase().includes(keyword);
    return matchTitle || matchCategory;
  });

  // Render ulang hasil yang sudah difilter
  renderProducts(filteredProducts);
}

// 4. Hubungkan Event Listener dengan Fungsi Debounce
const searchInput = document.getElementById('search-input');

// Bungkus fungsi handleSearch dengan createDebounce
const debouncedSearch = createDebounce(handleSearch, 300);

// Gunakan event 'input' agar merespons setiap perubahan teks
searchInput.addEventListener('input', debouncedSearch);

// Inisialisasi pengambilan data saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', fetchProducts);