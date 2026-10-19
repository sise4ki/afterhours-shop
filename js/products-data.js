// AFTERHOURS® — CENTRAL PRODUCTS DATABASE
const AFTERHOURS_PRODUCTS = {
    "balenciaga-runner": {
        id: "balenciaga-runner",
        name: "BALENCIAGA RUNNER",
        title: "Balenciaga Runner | AFTERHOURS®",
        category: "FOOTWEAR / BALENCIAGA",
        price: 895,
        image: "assets/images/balenciaga-runner.png",
        alt: "Balenciaga Runner sneakers",
        reference: "AH-001-RUN",
        number: "PRODUCT / 001",
        sizes: ["40", "41", "42", "43", "44", "45"],
        sizeLabel: "SELECT SIZE (EU)",
        description: "A statement sneaker selected for the AFTERHOURS® collection. Designed for a bold silhouette and an unmistakable streetwear look.",
        url: "product.html?product=balenciaga-runner"
    },
    "balenciaga-track": {
        id: "balenciaga-track",
        name: "BALENCIAGA TRACK",
        title: "Balenciaga Track | AFTERHOURS®",
        category: "FOOTWEAR / BALENCIAGA",
        price: 1050,
        image: "assets/images/balenciaga-track.png",
        alt: "Balenciaga Track sneakers",
        reference: "AH-002-TRK",
        number: "PRODUCT / 002",
        sizes: ["40", "41", "42", "43", "44", "45"],
        sizeLabel: "SELECT SIZE (EU)",
        description: "A technical statement sneaker selected for the AFTERHOURS® collection. Bold proportions and a distinctive streetwear silhouette.",
        url: "product.html?product=balenciaga-track"
    },
    "balenciaga-hoodie": {
        id: "balenciaga-hoodie",
        name: "BALENCIAGA HOODIE",
        title: "Balenciaga Hoodie | AFTERHOURS®",
        category: "CLOTHING / BALENCIAGA",
        price: 1200,
        image: "assets/images/balenciaga-hoodie.png",
        alt: "Balenciaga oversized hoodie",
        reference: "AH-003-HOD",
        number: "PRODUCT / 003",
        sizes: ["S", "M", "L", "XL"],
        sizeLabel: "SELECT SIZE",
        description: "An oversized statement hoodie selected for the AFTERHOURS® collection. A relaxed silhouette designed for a bold streetwear look.",
        url: "product.html?product=balenciaga-hoodie"
    },
    "maison-margiela-future": {
        id: "maison-margiela-future",
        name: "MAISON MARGIELA FUTURE",
        title: "Maison Margiela Future | AFTERHOURS®",
        category: "FOOTWEAR / MAISON MARGIELA",
        price: 750,
        image: "assets/images/maison-margiela-future.png",
        alt: "Maison Margiela Future sneakers",
        reference: "AH-004-MMF",
        number: "PRODUCT / 004",
        sizes: ["40", "41", "42", "43", "44", "45"],
        sizeLabel: "SELECT SIZE (EU)",
        description: "A futuristic high-top sneaker with a distinctive silhouette, selected for the AFTERHOURS® collection.",
        url: "product.html?product=maison-margiela-future"
    },
    "giuseppe-zanotti": {
        id: "giuseppe-zanotti",
        name: "GIUSEPPE ZANOTTI",
        title: "Giuseppe Zanotti | AFTERHOURS®",
        category: "FOOTWEAR / GIUSEPPE ZANOTTI",
        price: 650,
        image: "assets/images/giuseppe-zanotti.png",
        alt: "Giuseppe Zanotti sneakers",
        reference: "AH-005-GZ",
        number: "PRODUCT / 005",
        sizes: ["40", "41", "42", "43", "44", "45"],
        sizeLabel: "SELECT SIZE (EU)",
        description: "A bold designer footwear selection with a statement silhouette and a luxury streetwear aesthetic.",
        url: "product.html?product=giuseppe-zanotti"
    },
    "bape-hoodie": {
        id: "bape-hoodie",
        name: "BAPE HOODIE",
        title: "BAPE Hoodie | AFTERHOURS®",
        category: "CLOTHING / BAPE",
        price: 350,
        image: "assets/images/bape-hoodie.png",
        alt: "BAPE hoodie",
        reference: "AH-006-BAP",
        number: "PRODUCT / 006",
        sizes: ["S", "M", "L", "XL"],
        sizeLabel: "SELECT SIZE",
        description: "A statement hoodie inspired by Japanese streetwear, selected for the AFTERHOURS® collection.",
        url: "product.html?product=bape-hoodie"
    },
    "jimmy-choo": {
        id: "jimmy-choo",
        name: "JIMMY CHOO",
        title: "Jimmy Choo Sneakers | AFTERHOURS®",
        category: "FOOTWEAR / JIMMY CHOO",
        price: 700,
        image: "assets/images/jimmy-choo.png",
        alt: "Jimmy Choo sneakers",
        reference: "AH-007-JC",
        number: "PRODUCT / 007",
        sizes: ["40", "41", "42", "43", "44", "45"],
        sizeLabel: "SELECT SIZE (EU)",
        description: "Designer footwear selected for its refined finish and distinctive luxury aesthetic.",
        url: "product.html?product=jimmy-choo"
    },
    "dior-jeans": {
        id: "dior-jeans",
        name: "CHRISTIAN DIOR JEANS",
        title: "Christian Dior Jeans | AFTERHOURS®",
        category: "CLOTHING / DIOR",
        price: 500,
        image: "assets/images/dior-jeans.png",
        alt: "Christian Dior jeans",
        reference: "AH-008-CDJ",
        number: "PRODUCT / 008",
        sizes: ["28", "29", "30", "31", "32", "33", "34"],
        sizeLabel: "SELECT WAIST SIZE",
        description: "Designer denim selected for the AFTERHOURS® collection, bringing a luxury edge to everyday streetwear.",
        url: "product.html?product=dior-jeans"
    }
};

// Глобальная функция обновления плавающей корзины, доступная везде
function updateFloatingCart() {
    const button = document.querySelector("#floatingCart");
    const countElement = document.querySelector("#floatingCartCount");
    if (!button || !countElement) return;

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("afterhours-cart")) || [];
    } catch {
        cart = [];
    }

    const count = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0)
        : 0;

    countElement.textContent = `${count} ${count === 1 ? "ITEM" : "ITEMS"}`;
    button.classList.toggle("is-visible", count > 0);
}

document.addEventListener("DOMContentLoaded", updateFloatingCart);
window.addEventListener("storage", updateFloatingCart);
