const cartIcon = document.querySelector("#cart");
const cart = document.querySelector(".cart-modal");
const cartClose = document.querySelector("#cart-close");
const addCartButtons = document.querySelector(".add-to-cart-btn");

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const cartContent = document.querySelector(".cart-content")
const catalogContainer = document.getElementById("catalog");

// Menggunakan Event Delegation pada container katalog
catalogContainer.addEventListener("click", event => {
    // Cek apakah yang diklik adalah tombol tambah keranjang
    if (event.target.classList.contains("add-to-cart-btn")) {
        const productCard = event.target.closest(".product-card");
        addToCart(productCard);
    }
});

//Membuat fungsi untuk menambahkan element ke shopping cart
const addToCart = productBox => {
    const productImgSrc = productBox.querySelector(".product-thumbnail").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".current-price").textContent;


    //Agar tidak terjadi duplikasi
    const cartItems = cartContent.querySelectorAll(".cart-product-title");
        for (let item of cartItems) {
        if (item.textContent === productTitle){
        alert("This item is already in the cart.");
        return;
        }

    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    //Using back tics karena kita akan menambahkan variabel ke HTML string
    cartBox.innerHTML = `
                <img src="${productImgSrc}" class="cart-img" alt="${productTitle}">
                <div class="cart-detail">
                    <h2 class="cart-product-title">${productTitle}</h2>
                <span class="cart-price">${productPrice}</span>
                    <div class="cart-quantity">
                        <button id="decrement">-</button>
                        <span class="number">1</span>
                        <button id="increment">+</button>

                    </div>
                </div>
                <i class="ri-delete-bin-line cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);
};
