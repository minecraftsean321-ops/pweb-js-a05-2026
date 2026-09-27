if (!localStorage.getItem("firstName")) {
  window.location.href = "login.html"; 
}

const API_URL = 'https://dummyjson.com/products';
const catalog = document.getElementById('catalog');

//Untuk menyimpan data produk asli dari API, untuk filter dan load more
let allProducts = [];
let currentFilteredProducts = []; 
let visibleCount = 8;

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
    currentFilteredProducts = [...allProducts];
    populateCategories(); 
    updateDisplay();
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
const debouncedSearch = createDebounce(applyFiltersAndSort, 300);

// Gunakan event 'input' agar merespons setiap perubahan teks
searchInput.addEventListener('input', debouncedSearch);

// Inisialisasi pengambilan data saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', fetchProducts);

function populateCategories() {
  const categorySelect = document.getElementById('category-filter');
  const categories = [...new Set(allProducts.map(p => p.category))]; 
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function applyFiltersAndSort() {
  const category = document.getElementById('category-filter').value;
  const sortVal = document.getElementById('sort-filter').value;
  const keyword = document.getElementById('search-input').value.toLowerCase().trim();

  currentFilteredProducts = allProducts.filter(product => {
    const matchCategory = category === 'all' || product.category === category;
    const matchTitle = product.title.toLowerCase().includes(keyword);
    const matchCatSearch = product.category.toLowerCase().includes(keyword);
    return matchCategory && (matchTitle || matchCatSearch);
  });

  if (sortVal === 'price-asc') currentFilteredProducts.sort((a, b) => a.price - b.price);
  else if (sortVal === 'price-desc') currentFilteredProducts.sort((a, b) => b.price - a.price);
  else if (sortVal === 'rating-desc') currentFilteredProducts.sort((a, b) => b.rating - a.rating);

  visibleCount = 8; 
  updateDisplay();
}

function updateDisplay() {
  const productsToShow = currentFilteredProducts.slice(0, visibleCount);
  renderProducts(productsToShow); 

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (visibleCount >= currentFilteredProducts.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

document.getElementById('category-filter').addEventListener('change', applyFiltersAndSort);
document.getElementById('sort-filter').addEventListener('change', applyFiltersAndSort);
document.getElementById('load-more-btn').addEventListener('click', () => {
  visibleCount += 8;
  updateDisplay();
});

// EVENT DELEGATION: MODAL DETAIL PRODUK
catalog.addEventListener('click', function(event) {
  // Biarkan modal.js yang mengurus Add to Cart
  if (event.target.classList.contains('add-to-cart-btn')) return; 

  const card = event.target.closest('.product-card');
  if (card) {
    const productId = parseInt(card.getAttribute('data-id'));
    const product = allProducts.find(p => p.id === productId);
    if (product) tampilkanModal(product);
  }
});

function tampilkanModal(product) {
  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('product-modal-body');
  
  modalBody.innerHTML = `
    <h2 style="margin-bottom: 15px;">${product.title}</h2>
    <img src="${product.thumbnail}" alt="${product.title}" style="width: 100%; max-width: 250px; border-radius: 8px; margin-bottom: 15px;">
    <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
    <p><strong>Kategori:</strong> ${product.category}</p>
    <p><strong>Stock Tersedia:</strong> ${product.stock} pcs</p>
    <p style="margin-top: 15px;"><strong>Deskripsi:</strong><br>${product.description}</p>
  `;
  modal.style.display = 'flex';
}

document.getElementById('close-product-modal').addEventListener('click', () => {
  document.getElementById('product-modal').style.display = 'none';
});
window.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  if (e.target === modal) modal.style.display = 'none';
});

