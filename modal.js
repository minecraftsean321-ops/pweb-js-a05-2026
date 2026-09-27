const cartIcon = document.querySelector("#cart");
const cart = document.querySelector(".cart-modal");
const cartClose = document.querySelector("#cart-close");
const addCartButtons = document.querySelector(".add-to-cart-btn");

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const cartContent = document.querySelector(".cart-content")
const catalogContainer = document.getElementById("catalog");

//Ambil data dari local storage
function getCart () {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

//Delete
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
}




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

    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();

        updateTotalPrice();
        updateCartCount(-1);
    });

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector("#decrement");
        let quantity = numberElement.textContent;

        if (event.target.id === "decrement" && quantity > 1) {
            quantity--;

            if(quantity === 1){
                decrementButton.style.color = "#999";
            }

        } else if (event.target.id === "increment") {
                quantity++;
                decrementButton.style.color = "#333";
            }

            numberElement.textContent = quantity;

            updateTotalPrice();

    });

    updateTotalPrice();

    updateCartCount(1);
};

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes= cartContent.querySelectorAll(".cart-box");
    let total = 0;
    cartBoxes.forEach(cartBox => {
        const totalPriceElement= cartBox.querySelector(".cart-price");
        const quantityElement= cartBox.querySelector(".number");
        const price = totalPriceElement.textContent.replace("$", "")
        const quantity = quantityElement.textContent;
        total += price * quantity;
    });
    totalPriceElement.textContent = `$${total.toFixed(2)}`;

};

let cartItemCount = 0;
const updateCartCount = change => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    cartItemCount += change;
    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent= cartItemCount;
    } else{
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }

};

//Fungsi untuk tombol beli
const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0){
        alert("Your cart is empty. Please add items to your cart before buying.");
        return;

    }

    cartBoxes.forEach(cartBoxes => cartBoxes.remove());

    cartItemCount = 0;
    updateCartCount(0);

    updateTotalPrice();

    alert("Thank you for your purchase!")

});