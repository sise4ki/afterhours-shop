// AFTERHOURS — SECURE CHECKOUT SYSTEM (FINAL FIX)

const form = document.querySelector("#checkoutForm");
const errorMessage = document.querySelector("#checkoutError");
const itemsContainer = document.querySelector("#checkoutItems");
const subtotalElement = document.querySelector("#checkoutSubtotal");
const shippingElement = document.querySelector("#checkoutShipping");
const totalElement = document.querySelector("#checkoutTotal");
const successSection = document.querySelector("#orderSuccess");
const referenceElement = document.querySelector("#orderReference");
const successTotalElement = document.querySelector("#successTotal");

// Читаем корзину напрямую без жестких скрытых фильтров
function readCart() {
    try {
        const data = JSON.parse(localStorage.getItem("afterhours-cart") || "[]");
        if (!Array.isArray(data)) return [];
        
        // Убираем избыточные проверки типов, чтобы данные не обнулялись из-за нестыковки ключей
        return data.filter(item => item && (item.name || item.id) && item.quantity > 0);
    } catch {
        return [];
    }
}

function money(value) {
    return `€ ${Number(value).toFixed(2)}`;
}

function getShipping() {
    const selected = document.querySelector('input[name="shipping"]:checked');
    return selected?.value === "express" ? 25.00 : 10.00;
}

function renderSummary() {
    const cart = readCart();
    
    if (!itemsContainer) return { cart, subtotal: 0, shipping: 0, total: 0 };
    itemsContainer.innerHTML = "";

    // Если в localStorage действительно ничего нет
    if (cart.length === 0) {
        itemsContainer.innerHTML = `<p class="checkout-item-meta" style="padding: 15px 0; color: #777;">YOUR BAG IS EMPTY</p>`;
    }

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "checkout-item";

        // Проверяем наличие картинки. Если её нет — ставим заглушку, чтобы код не падал
        const image = document.createElement("img");
        image.src = item.image || "assets/images/placeholder.png"; 
        image.alt = item.name || "Product";

        const details = document.createElement("div");
        const name = document.createElement("p");
        name.className = "checkout-item-name";
        name.textContent = item.name || "STREETWEAR ITEM";

        const meta = document.createElement("p");
        meta.className = "checkout-item-meta";
        meta.textContent = `SIZE: ${item.size || "ONESIZE"} · QTY: ${item.quantity}`;

        details.append(name, meta);

        const price = document.createElement("strong");
        price.className = "checkout-item-price";
        
        // Гарантируем, что цена и количество преобразуются в числа
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.quantity) || 1;
        price.textContent = money(itemPrice * itemQty);

        row.append(image, details, price);
        itemsContainer.appendChild(row);
    });

    const subtotal = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
    const shipping = getShipping();

    if (subtotalElement) subtotalElement.textContent = money(subtotal);
    if (shippingElement) shippingElement.textContent = money(shipping);
    if (totalElement) totalElement.textContent = money(subtotal + shipping);

    return { cart, subtotal, shipping, total: subtotal + shipping };
}

// Отслеживаем переключение радиокнопок доставки
document.querySelectorAll('input[name="shipping"]').forEach(input => {
    input.addEventListener("change", renderSummary);
});

if (form) {
    form.addEventListener("submit", event => {
        event.preventDefault();
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton && submitButton.disabled) return;
        if (errorMessage) errorMessage.textContent = "";

        const order = renderSummary();

        if (order.cart.length === 0) {
            if (errorMessage) errorMessage.textContent = "Your bag is empty. Add a product before placing an order.";
            return;
        }

        if (!form.reportValidity()) return;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "ORDER CONFIRMED";
        }

        const reference = "AH-" + Date.now().toString().slice(-8);

        if (referenceElement) referenceElement.textContent = reference;
        if (successTotalElement) {
            successTotalElement.textContent = `Demo order total: ${money(order.total)}. No payment was taken.`;
        }

        form.hidden = true;
        const summaryBox = document.querySelector(".checkout-summary");
        const headingBox = document.querySelector(".checkout-heading");
        if (summaryBox) summaryBox.hidden = true;
        if (headingBox) headingBox.hidden = true;
        if (successSection) successSection.hidden = false;

        // Локальное сохранение логов истории заказов
        try {
            const savedOrders = JSON.parse(localStorage.getItem("afterhours-orders") || "[]");
            const completedOrder = {
                reference,
                createdAt: new Date().toISOString(),
                status: "confirmed",
                customer: {
                    email: form.email ? form.email.value.trim() : "",
                    firstName: form.firstName ? form.firstName.value.trim() : "",
                    lastName: form.lastName ? form.lastName.value.trim() : "",
                    phone: form.phone ? form.phone.value.trim() : ""
                },
                items: order.cart,
                total: order.total
            };
            savedOrders.push(completedOrder);
            localStorage.setItem("afterhours-orders", JSON.stringify(savedOrders));
        } catch (e) {
            console.error("History save failed", e);
        }

        // Очищаем корзину
        localStorage.removeItem("afterhours-cart");
        if (typeof updateFloatingCart === "function") {
            updateFloatingCart();
        }
    });
}

// Инициализация при загрузке страницы
renderSummary();
