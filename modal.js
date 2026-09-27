const cartIcon = document.querySelector("#cart");
const cart = document.querySelector(".cart-modal");
const cartClose = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const addCartButtons = document.querySelector(".add-to-cart-btn");
addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
        const productBox = event.target.closest(".product-box");
        addCartButtons(productBox);

    })


})