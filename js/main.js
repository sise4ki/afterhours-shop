// AFTERHOURS® — ANIMATIONS, CATALOG & CLICK SLIDER SYSTEM

window.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".site-loader");
    const loaderProgress = document.querySelector(".loader-progress");
    const titleLines = document.querySelectorAll(".title-line");
    const eyebrow = document.querySelector(".hero-eyebrow");
    const heroDescription = document.querySelector(".hero-description");
    const roundLink = document.querySelector(".round-link");
    const heroEdition = document.querySelector(".hero-edition");
    const header = document.querySelector(".site-header");
    const heroTopline = document.querySelector(".hero-topline");
    const hero = document.querySelector(".hero");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const productCards = document.querySelectorAll(".product-card");

    // 1. Проверяем, загрузился ли GSAP.
    if (typeof gsap === "undefined") {
        loader?.remove();
    } else {
        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        // 2. Основные 3D анимации карточек.
        productCards.forEach((card) => {
            const visual = card.querySelector(".product-visual, .product-image, img");
            if (reduceMotion) return;

            card.addEventListener("pointermove", (event) => {
                if (event.pointerType === "touch") return;
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width;
                const y = (event.clientY - bounds.top) / bounds.height;

                gsap.to(card, {
                    rotationY: (x - 0.5) * 8,
                    rotationX: (0.5 - y) * 8,
                    transformPerspective: 900,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });

            card.addEventListener("pointerleave", () => {
                gsap.to(card, {
                    rotationX: 0, rotationY: 0, duration: 0.5, ease: "power3.out", overwrite: "auto"
                });
                if (visual) {
                    gsap.to(visual, { scale: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" });
                }
            });

            if (visual) {
                card.addEventListener("pointerenter", () => {
                    gsap.to(visual, { scale: 1.06, duration: 0.6, ease: "power3.out", overwrite: "auto" });
                });
            }
        });

        if (reduceMotion) {
            loader?.remove();
        } else {
            // 3. Анимация появления сайта.
            const intro = gsap.timeline({
                defaults: { ease: "power3.out" },
                onComplete: () => { loader?.remove(); }
            });

            intro
                .to(loaderProgress, { scaleX: 1, duration: 0.9, ease: "power2.inOut" })
                .to(loader, { autoAlpha: 0, duration: 0.55, ease: "power2.inOut" })
                .from(header, { y: -25, autoAlpha: 0, duration: 0.65 }, "-=0.15")
                .from(heroTopline, { y: 12, autoAlpha: 0, duration: 0.5 }, "-=0.3")
                .from(eyebrow, { y: 20, autoAlpha: 0, duration: 0.5 }, "-=0.2")
                .from(titleLines, { yPercent: 110, autoAlpha: 0, duration: 1, stagger: 0.16, ease: "power4.out" }, "-=0.1")
                .from([heroDescription, roundLink, heroEdition].filter(Boolean), { y: 20, autoAlpha: 0, duration: 0.65, stagger: 0.12 }, "-=0.45");

            gsap.to(".hero-glow", { scale: 1.18, opacity: 0.7, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
            gsap.to(".orbit-one", { rotation: 360, duration: 45, repeat: -1, ease: "none" });
            gsap.to(".orbit-two", { rotation: -360, duration: 32, repeat: -1, ease: "none" });

            if (hero && window.matchMedia("(pointer: fine)").matches) {
                hero.addEventListener("pointermove", (event) => {
                    const bounds = hero.getBoundingClientRect();
                    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                    gsap.to(".hero-glow", { x: x * 35, y: y * 35, duration: 0.7, ease: "power2.out", overwrite: "auto" });
                });

                hero.addEventListener("pointerleave", () => {
                    gsap.to(".hero-glow", { x: 0, duration: 0.7, ease: "power2.out", overwrite: "auto" });
                });
            }

            if (typeof ScrollTrigger !== "undefined") {
                gsap.to(".hero-title", { y: -100, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
                gsap.to(".hero-glow", { y: -150, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
                if (document.querySelector(".hero-orbits")) {
                    gsap.to(".hero-orbits", { y: 100, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
                }

                gsap.utils.toArray(".manifesto, .collection").forEach((section) => {
                    const elements = section.querySelectorAll(".section-label, h2, .manifesto-copy, .product-card");
                    if (!elements.length) return;
                    gsap.from(elements, { y: 45, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 80%", once: true } });
                });
            }
        }
    }

    // ===== ЛОГИКА КЛИКАБЕЛЬНОГО СЛАЙДЕРА ИНФОРМАЦИИ =====
    const slides = document.querySelectorAll(".slide-item");
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");
    
    if (slides.length > 0 && prevBtn && nextBtn) {
        let currentSlideIndex = 0;

        function changeSlide(nextIndex) {
            // Убираем класс активного у старого слайда
            slides[currentSlideIndex].classList.remove("active");
            
            // Задаем новый индекс с учетом кругового переключения
            currentSlideIndex = (nextIndex + slides.length) % slides.length;
            
            // Включаем новый слайд
            slides[currentSlideIndex].classList.add("active");
        }

        nextBtn.addEventListener("click", () => {
            changeSlide(currentSlideIndex + 1);
        });

        prevBtn.addEventListener("click", () => {
            changeSlide(currentSlideIndex - 1);
        });
    }

    // CATALOG CONTROLS (SEARCH & FILTERS)
    const catalogSearch = document.querySelector("#productSearch");
    const categoryFilter = document.querySelector("#categoryFilter");
    const sortFilter = document.querySelector("#sortFilter");
    const catalogResults = document.querySelector("#catalogResults");
    const productGrid = document.querySelector(".product-grid");

    if (catalogSearch && categoryFilter && sortFilter && catalogResults && productGrid) {
        const products = Array.from(productGrid.querySelectorAll(".product-card"));

        function filterAndSortProducts() {
            const searchValue = catalogSearch.value.trim().toLowerCase();
            const selectedCategory = categoryFilter.value;
            const selectedSort = sortFilter.value;

            let visibleProducts = products.filter((product) => {
                const name = product.querySelector(".product-name")?.textContent.trim().toLowerCase() || "";
                const category = product.querySelector(".product-category")?.textContent.trim().toLowerCase() || "";
                const matchesSearch = name.includes(searchValue) || category.includes(searchValue);
                let matchesCategory = true;

                if (selectedCategory === "sneakers") matchesCategory = category.includes("footwear");
                if (selectedCategory === "clothing") matchesCategory = category.includes("clothing") || category.includes("apparel");

                return matchesSearch && matchesCategory;
            });

            if (selectedSort === "low-high") visibleProducts.sort((a, b) => getPrice(a) - getPrice(b));
            if (selectedSort === "high-low") visibleProducts.sort((a, b) => getPrice(b) - getPrice(a));
            if (selectedSort === "name") {
                visibleProducts.sort((a, b) => {
                    const nameA = a.querySelector(".product-name").textContent.trim();
                    const nameB = b.querySelector(".product-name").textContent.trim();
                    return nameA.localeCompare(nameB);
                });
            }

            products.forEach(p => p.style.display = "none");
            visibleProducts.forEach(p => {
                p.style.display = "";
                productGrid.appendChild(p);
            });

            catalogResults.textContent = `${visibleProducts.length} PRODUCTS`;
        }

        function getPrice(product) {
            const priceText = product.querySelector(".product-price")?.textContent || "";
            return Number(priceText.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
        }

        catalogSearch.addEventListener("input", filterAndSortProducts);
        categoryFilter.addEventListener("change", filterAndSortProducts);
        sortFilter.addEventListener("change", filterAndSortProducts);

        filterAndSortProducts();
    }
});
