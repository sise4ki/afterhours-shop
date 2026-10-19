
// AFTERHOURS — SHOPPING BAG

const cartItemsElement = document.querySelector("#cartItems");
const cartCountElement = document.querySelector("#cartCount");
const cartSubtotalElement = document.querySelector("#cartSubtotal");
const cartTotalElement = document.querySelector("#cartTotal");
const checkoutButton = document.querySelector("#checkoutButton");
const checkoutMessage = document.querySelector("#checkoutMessage");

function getCart() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("afterhours-cart") || "[]"
        );

        if (!Array.isArray(saved)) return [];

        return saved.filter(item =>
            item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            Number.isFinite(Number(item.price)) &&
            Number(item.price) >= 0 &&
            Number.isFinite(Number(item.quantity)) &&
            Number(item.quantity) > 0
        ).map(item => ({
            ...item,
            price: Number(item.price),
            quantity: Math.floor(Number(item.quantity))
        })).filter(item => item.quantity > 0);
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("afterhours-cart", JSON.stringify(cart));
}

function formatPrice(price) {
    return `€ ${Number(price).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function renderCart() {
    const cart = getCart();

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCountElement.textContent = ` (${totalItems})`;
    cartSubtotalElement.textContent = formatPrice(subtotal);
    cartTotalElement.textContent = formatPrice(subtotal);

    checkoutButton.disabled = cart.length === 0;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = `
            <div class="cart-empty">
                YOUR BAG IS EMPTY.<br>
                <a href="index.html#collection">
                    EXPLORE THE COLLECTION ↗
                </a>
            </div>
        `;
        return;
    }

    cartItemsElement.innerHTML = cart.map((item, index) => `
        <article class="cart-item">
            <img
                class="cart-item-image"
                src="${item.image || ""}"
                alt="${item.name}"
            >

            <div class="cart-item-info">
                <h2 class="cart-item-name">${item.name}</h2>

                <div class="cart-item-meta">
                    SIZE: ${item.size}<br>
                    REF: ${item.id}
                </div>

                <p class="cart-item-price">
                    ${formatPrice(item.price)}
                </p>

                <div class="cart-item-actions">
                    <button
                        class="quantity-button"
                        type="button"
                        data-action="decrease"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                    >−</button>

                    <span class="quantity-value">${item.quantity}</span>

                    <button
                        class="quantity-button"
                        type="button"
                        data-action="increase"
                        data-index="${index}"
                        aria-label="Increase quantity"
                    >+</button>

                    <button
                        class="remove-button"
                        type="button"
                        data-action="remove"
                        data-index="${index}"
                    >REMOVE</button>
                </div>
            </div>

            <strong class="cart-item-line-total">
                ${formatPrice(item.price * item.quantity)}
            </strong>
        </article>
    `).join("");
}

cartItemsElement.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const index = Number(button.dataset.index);
    const cart = getCart();
    const item = cart[index];

    if (!item) return;

    switch (button.dataset.action) {
        case "increase":
            item.quantity += 1;
            break;

        case "decrease":
            item.quantity -= 1;

            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }
            break;

        case "remove":
            cart.splice(index, 1);
            break;

        default:
            return;
    }

    saveCart(cart);
    checkoutMessage.textContent = "";
    renderCart();
});

checkoutButton.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
        checkoutMessage.textContent = "YOUR BAG IS EMPTY.";
        return;
    }

    window.location.href = "checkout.html";
});

renderCart();