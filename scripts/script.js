// Отримання товарів з JSON файлу
async function getProducts() {
    try {
        const response = await fetch('products.json')
        const products = await response.json()
        return products
    } catch (error) {
        console.error('Помилка завантаження товарів:', error)
        return []
    }
}

let allProducts = [];

// Функція для створення HTML картки товару
function getCardHTML(product) {
    return `
<div class="product-card">
    <button class="favorite-btn" data-product-id="${product.id}"><svg width="24" height="24" viewBox="0 0 33 33" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
<path d="M29.0074 17.5824L16.5139 31.5L4.02035 17.5824C3.19629 16.6805 2.54719 15.5964 2.11392 14.3984C1.68066 13.2004 1.47261 11.9145 1.50289 10.6216C1.53317 9.32878 1.80111 8.05697 2.28985 6.88631C2.77858 5.71564 3.47753 4.67148 4.34267 3.81957C5.2078 2.96767 6.22039 2.32647 7.31667 1.93636C8.41294 1.54624 9.56916 1.41567 10.7125 1.55286C11.8558 1.69004 12.9616 2.09201 13.96 2.73346C14.9584 3.37491 15.828 4.24194 16.5139 5.27995C17.2027 4.24947 18.0733 3.39002 19.0711 2.75538C20.0688 2.12074 21.1723 1.72457 22.3124 1.59168C23.4526 1.45878 24.6048 1.59201 25.6971 1.98303C26.7893 2.37405 27.7981 3.01445 28.6602 3.86414C29.5223 4.71383 30.2192 5.75452 30.7072 6.92107C31.1953 8.08763 31.464 9.35495 31.4966 10.6437C31.5292 11.9325 31.325 13.2149 30.8967 14.4108C30.4683 15.6067 29.8252 16.6902 29.0074 17.5937" stroke="#ff0040" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg></button>
    <a href="product.html?id=${product.id}" class="product-image-link">
        <img src="img/${product.image}" 
            alt="${product.title}"
            onerror="this.src='https://via.placeholder.com/300x200?text=Немає+зображення'">
    </a>

    <div class="product-body">
        <a href="product.html?id=${product.id}" class="product-title">
            ${product.title}
        </a>

        <p class="product-desc">${product.description}</p>

        <div class="product-bottom">
            <p class="product-price">${product.price} грн</p>

            <button class="buy-btn" data-product-id="${product.id}">
                Купити
            </button> 
        </div>
    </div>
</div>
    `
}

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("favorite-btn") || e.target.closest(".favorite-btn")) {
        // Обработка уже в favorite.js
        return;
    }
})


// Функція додавання товару до кошика
function addToCart(event) {
    const productId = parseInt(event.target.getAttribute('data-product-id'));
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
    }
}

let productSwiper = null
let clothingSwiper = null
let gamesSwiper = null

getProducts().then(function(products) {
    allProducts = products;
    window.allProducts = products;
    // Техніка (Електроніка)
    const electronicsProducts = products.filter(p => p.category === 'Електроніка').slice(0, 8);
    const swiperWrapper = document.getElementById('swiper-products-list')
    if (swiperWrapper) {
        swiperWrapper.innerHTML = electronicsProducts.map(product => `
            <div class="swiper-slide">
                ${getCardHTML(product)}
            </div>
        `).join('')
        productSwiper = new Swiper('.product-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: electronicsProducts.length >= 4,
            speed: 600,
            autoplay: electronicsProducts.length >= 2 ? {
                delay: 4000,
                disableOnInteraction: false,
            } : false,
            watchOverflow: false,
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4 }
            },
            navigation: {
                nextEl: '.product-swiper .swiper-button-next',
                prevEl: '.product-swiper .swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        })
        swiperWrapper.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
        // Обновляем статус кнопок "Нравится"
        if (typeof favorites !== 'undefined') {
            favorites.updateUI();
        }
    }

    // Одяг
    const clothingProducts = products.filter(p => p.category === 'Одяг').slice(0, 8);
    const clothingWrapper = document.getElementById('swiper-clothing-list')
    if (clothingWrapper) {
        clothingWrapper.innerHTML = clothingProducts.map(product => `
            <div class="swiper-slide">
                ${getCardHTML(product)}
            </div>
        `).join('')
        clothingSwiper = new Swiper('.clothing-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: clothingProducts.length >= 4,
            speed: 600,
            autoplay: clothingProducts.length >= 2 ? {
                delay: 4000,
                disableOnInteraction: false,
            } : false,
            watchOverflow: false,
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4 }
            },
            navigation: {
                nextEl: '.clothing-swiper .swiper-button-next',
                prevEl: '.clothing-swiper .swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        })
        clothingWrapper.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
        if (typeof favorites !== 'undefined') {
            favorites.updateUI();
        }
    }

    // Ігри
    const gamesProducts = products.filter(p => p.category === 'Ігри').slice(0, 8);
    const gamesWrapper = document.getElementById('swiper-games-list')
    if (gamesWrapper) {
        gamesWrapper.innerHTML = gamesProducts.map(product => `
            <div class="swiper-slide">
                ${getCardHTML(product)}
            </div>
        `).join('')
        gamesSwiper = new Swiper('.games-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: gamesProducts.length >= 4,
            speed: 600,
            autoplay: gamesProducts.length >= 2 ? {
                delay: 4000,
                disableOnInteraction: false,
            } : false,
            watchOverflow: false,
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4 }
            },
            navigation: {
                nextEl: '.games-swiper .swiper-button-next',
                prevEl: '.games-swiper .swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        })
        gamesWrapper.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
        if (typeof favorites !== 'undefined') {
            favorites.updateUI();
        }
    }

    const buyButtons = document.querySelectorAll('.buy-btn')
    buyButtons.forEach(function(button) {
        button.addEventListener('click', addToCart)
    })
})

getProducts().then(function(products) {
    const productsList = document.querySelector('#products-list')
    if (productsList) {
        // Показуємо тільки перші 6 товарів на головній
        const featuredProducts = products.slice(0, 4)
        
        featuredProducts.forEach(function(product) {
            productsList.innerHTML += getCardHTML(product)
        })

        // Додаємо обробники подій для кнопок "Купити"
        const buyButtons = document.querySelectorAll('.buy-btn')
        buyButtons.forEach(function(button) {
            button.addEventListener('click', addToCart)
        })
    }
})

const slider = document.querySelector(".slider")
const navButtons = document.querySelectorAll(".slider-nav p")
const slides = document.querySelectorAll(".slider img")

let index = 0

navButtons.forEach(function(btn, index){
btn.addEventListener("click", function(){
    slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth"
        })
    })
})

function updateDots(){
    navButtons.forEach(d => d.classList.remove("active"))
    navButtons[index].classList.add("active")
}
updateDots()

document.querySelector(".arrow-right").addEventListener("click", function(){
    index = (index + 1) % slides.length
    slider.scrollTo({
        left: slider.offsetWidth * index,
        behavior: "smooth"
    })
    updateDots()
})

document.querySelector(".arrow-left").addEventListener("click", function(){
    index = (index - 1 + slides.length) % slides.length
    slider.scrollTo({
        left: slider.offsetWidth * index,
        behavior: "smooth"
    })
    updateDots()
})


slider.addEventListener('scroll',function() {
    const newIndex = Math.round(slider.scrollLeft / slider.offsetWidth)
    if (newIndex !== index) {
        index = newIndex
        updateDots()
    }
})

// const  sliderWrapper = document.getElementById("swiper-products-list")

// products.forEach(function(product) {
//     sliderWrapper.innerHTML += `
//         <div class="swiper-slide">
//             <div class="product-card">
//                 <img src="img/${product.image}" alt="${product.title}">
//                 <h3 class="product-title">${product.title}</h3>
//                 <p class="product-price">${product.price} грн</p>
//                 <button class="buy-btn" data-product='${JSON.stringify(product)}'>Купити</button>
//             </div>
//         </div>
//     `
// })

