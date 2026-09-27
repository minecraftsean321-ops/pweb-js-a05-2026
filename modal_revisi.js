const cartIcon = document.querySelector("#cart");
const cart = document.querySelector(".cart-modal");
const cartClose = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const cartContent = document.querySelector(".cart-content");
const catalogContainer = document.getElementById("catalog");

// ====== LOCAL STORAGE HELPERS ======

// Ambil data dari local storage
function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

// Simpan data ke local storage lalu render ulang UI
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Hapus item dari local storage berdasarkan id
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
}

// Update quantity item tertentu di local storage
function updateQuantity(id, newQty) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty = newQty;
        saveCart(cart);
    }
}

// ====== TAMBAH ITEM (klik tombol add-to-cart) ======

catalogContainer.addEventListener("click", event => {
    if (event.target.classList.contains("add-to-cart-btn")) {
        const productCard = event.target.closest(".product-card");
        addToCart(productCard);
    }
});

const addToCart = productBox => {
    const productImgSrc = productBox.querySelector(".product-thumbnail").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".current-price").textContent;

    // ID unik: pakai data-id kalau ada di HTML, kalau tidak fallback ke title
    const productId = productBox.dataset.id || productTitle;

    const cartData = getCart();

    // Cek duplikasi langsung dari data localStorage (bukan dari DOM)
    const alreadyInCart = cartData.some(item => item.id === productId);
    if (alreadyInCart) {
        alert("This item is already in the cart.");
        return;
    }

    cartData.push({
        id: productId,
        title: productTitle,
        price: productPrice,
        img: productImgSrc,
        qty: 1
    });

    saveCart(cartData);
};

// ====== RENDER CART DARI LOCAL STORAGE ======

function renderCart() {
    const cartData = getCart();

    // Kosongkan dulu isi cart di DOM
    cartContent.innerHTML = "";

    cartData.forEach(item => {
        const cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
        cartBox.dataset.id = item.id;

        cartBox.innerHTML = `
            <img src="${item.img}" class="cart-img" alt="${item.title}">
            <div class="cart-detail">
                <h2 class="cart-product-title">${item.title}</h2>
                <span class="cart-price">${item.price}</span>
                <div class="cart-quantity">
                    <button class="decrement">-</button>
                    <span class="number">${item.qty}</span>
                    <button class="increment">+</button>
                </div>
            </div>
            <i class="ri-delete-bin-line cart-remove"></i>
        `;

        // Hapus item -> hapus dari local storage
        cartBox.querySelector(".cart-remove").addEventListener("click", () => {
            removeFromCart(item.id);
        });

        // Tombol quantity -> update local storage
        const decrementBtn = cartBox.querySelector(".decrement");
        const incrementBtn = cartBox.querySelector(".increment");
        const numberElement = cartBox.querySelector(".number");

        decrementBtn.style.color = item.qty <= 1 ? "#999" : "#333";

        decrementBtn.addEventListener("click", () => {
            if (item.qty > 1) {
                updateQuantity(item.id, item.qty - 1);
            }
        });

        incrementBtn.addEventListener("click", () => {
            updateQuantity(item.id, item.qty + 1);
        });

        cartContent.appendChild(cartBox);
    });

    updateTotalPrice(cartData);
    updateCartCount(cartData);
}

// ====== TOTAL HARGA & BADGE JUMLAH ITEM ======

const updateTotalPrice = cartData => {
    const totalPriceElement = document.querySelector(".total-price");
    let total = 0;

    cartData.forEach(item => {
        const price = parseFloat(item.price.replace("$", ""));
        total += price * item.qty;
    });

    totalPriceElement.textContent = `$${total.toFixed(2)}`;
};

const updateCartCount = cartData => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    const totalCount = cartData.reduce((sum, item) => sum + item.qty, 0);

    if (totalCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = totalCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
};

// ====== TOMBOL BELI ======

const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
    const cartData = getCart();

    if (cartData.length === 0) {
        alert("Your cart is empty. Please add items to your cart before buying.");
        return;
    }

    // Kosongkan cart + local storage
    saveCart([]);

    alert("Thank you for your purchase!");
});

// ====== RENDER CART SAAT HALAMAN DIBUKA ======
// Supaya cart tetap ada walau halaman di-refresh
renderCart();