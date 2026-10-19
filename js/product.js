// AFTERHOURS — PRODUCT PAGE SYSTEM (REFINED)

const params = new URLSearchParams(window.location.search);
const requestedProduct = params.get("product");
// По умолчанию открываем runner, если параметр пустой
const product = AFTERHOURS_PRODUCTS[requestedProduct] || AFTERHOURS_PRODUCTS["balenciaga-runner"];

const sizeButtonsContainer = document.querySelector(".size-options");
const addToCartButton = document.querySelector("#addToCart");
const cartMessage = document.querySelector("#cartMessage");

let selectedSize = null;

// Наполнение страницы актуальными данными товара
document.title = product.title;
document.querySelector("#detailNumber").textContent = product.number;
document.querySelector("#detailCategory").textContent = product.category;
document.querySelector("#detailName").textContent = product.name;
document.querySelector("#detailPrice").textContent = `€ ${product.price.toLocaleString("en-US")}.00`;
document.querySelector("#detailImage").src = product.image;
document.querySelector("#detailImage").alt = product.alt;
document.querySelector("#detailReference").textContent = product.reference;
document.querySelector("#detailDescription").textContent = product.description;
document.querySelector(".size-label").textContent = product.sizeLabel;

// Генерация кнопок размеров
sizeButtonsContainer.innerHTML = "";
product.sizes.forEach(size => {
    const button = document.createElement("button");
    button.className = "size-option";
    button.type = "button";
    button.dataset.size = size;
    button.textContent = size;
    sizeButtonsContainer.appendChild(button);
});

// Выбор размера
sizeButtonsContainer.addEventListener("click", event => {
    const button = event.target.closest(".size-option");
    if (!button) return;

    sizeButtonsContainer.querySelectorAll(".size-option").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    selectedSize = button.dataset.size;
    cartMessage.textContent = "";
});

// Добавление в корзину
addToCartButton.addEventListener("click", () => {
    if (!selectedSize) {
        cartMessage.textContent = "Please select your size first.";
        return;
    }

    const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        quantity: 1,
        image: product.image
    };

    let cart = [];
    try {
        const savedCart = JSON.parse(localStorage.getItem("afterhours-cart") || "[]");
        cart = Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        cart = [];
    }

    const existingProduct = cart.find(item => item.id === cartProduct.id && item.size === cartProduct.size);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(cartProduct);
    }

    localStorage.setItem("afterhours-cart", JSON.stringify(cart));
    updateFloatingCart(); // Вызов глобальной функции из базы данных
    cartMessage.textContent = "Added to cart successfully.";
});
