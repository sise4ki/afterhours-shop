// AFTERHOURS — WISHLIST SYSTEM (REFINED)

function getWishlist() {
    try {
        const saved = JSON.parse(localStorage.getItem("afterhours-wishlist") || "[]");
        return Array.isArray(saved) ? saved.filter(id => AFTERHOURS_PRODUCTS[id]) : [];
    } catch (error) {
        return [];
    }
}

function saveWishlist(items) {
    localStorage.setItem("afterhours-wishlist", JSON.stringify(items));
}

function renderWishlistButtons() {
    const favorites = getWishlist();

    document.querySelectorAll("[data-wishlist-id]").forEach(button => {
        const id = button.dataset.wishlistId;
        const active = favorites.includes(id);

        button.classList.toggle("is-favorite", active);
        button.textContent = active ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(active));
    });
}

// Добавление и удаление из избранного по клику
document.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest("[data-wishlist-id]");
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const id = button.dataset.wishlistId;
    if (!AFTERHOURS_PRODUCTS[id]) return;

    const favorites = getWishlist();
    const index = favorites.indexOf(id);

    if (index !== -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(id);
    }

    saveWishlist(favorites);
    renderWishlistButtons();

    document.dispatchEvent(new Event("wishlistUpdated"));
}, true);

// Отрисовка страницы Wishlist
function renderWishlistPage() {
    const container = document.getElementById("wishlistItems");
    const emptyMessage = document.getElementById("wishlistEmpty");

    if (!container || !emptyMessage) return;

    const favorites = getWishlist();

    container.innerHTML = "";
    emptyMessage.hidden = favorites.length > 0;
    container.hidden = favorites.length === 0;

    favorites.forEach(id => {
        const product = AFTERHOURS_PRODUCTS[id];
        if (!product) return;

        const card = document.createElement("article");
        card.className = "wishlist-card";

        card.innerHTML = `
            <a class="wishlist-card-image" href="${product.url}">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="wishlist-card-info">
                <p class="wishlist-card-category">${product.category}</p>
                <h2 class="wishlist-card-name">${product.name}</h2>
                <p class="wishlist-card-price">€${product.price.toLocaleString("en-US")}.00</p>
                <div class="wishlist-card-actions">
                    <a class="wishlist-view-button" href="${product.url}">VIEW PRODUCT ↗</a>
                    <button class="wishlist-remove-button" type="button" data-remove-wishlist="${product.id}">REMOVE ×</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Удаление товара прямо со страницы Wishlist
document.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest("[data-remove-wishlist]");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const id = button.dataset.removeWishlist;
    const favorites = getWishlist().filter(item => item !== id);

    saveWishlist(favorites);
    renderWishlistButtons();
    renderWishlistPage();

    document.dispatchEvent(new Event("wishlistUpdated"));
});

document.addEventListener("wishlistUpdated", renderWishlistPage);

// Стартовая инициализация
document.addEventListener("DOMContentLoaded", () => {
    renderWishlistButtons();
    renderWishlistPage();
});
