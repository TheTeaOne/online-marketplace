// Глобальні змінні
let allProducts = []
let filteredProducts = []

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

// Функція для створення HTML картки товару
function getCardHTML(product) {
    return `
        <div class="product-card">
    <button class="favorite-btn" data-product-id="${product.id}"><svg width="24" height="24" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// Відображення товарів на сторінці
function displayProducts(products) {
    const productsList = document.querySelector('#products-list')
    if (!productsList) return

    productsList.innerHTML = ''
    
    if (products.length === 0) {
        productsList.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Товари не знайдено</p></div>'
        return
    }

    products.forEach(function(product) {
        productsList.innerHTML += getCardHTML(product)
    })

    // Додаємо обробники подій для кнопок "Купити"
    const buyButtons = document.querySelectorAll('.buy-btn')
    buyButtons.forEach(function(button) {
        button.addEventListener('click', addToCart)
    })
}

// Функція додавання товару до кошика
function addToCart(event) {
    const productId = parseInt(event.target.getAttribute('data-product-id'));
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
    }
}

// Отримання унікальних категорій
function getCategories(products) {
    const categories = new Set()
    products.forEach(product => {
        if (product.category) {
            categories.add(product.category)
        }
    })
    return Array.from(categories)
}

// Заповнення фільтра категорій
function populateCategoryFilter(categories) {
    const categoryFilter = document.querySelector('#category-filter')
    if (!categoryFilter) return

    categories.forEach(category => {
        const option = document.createElement('option')
        option.value = category
        option.textContent = category
        categoryFilter.appendChild(option)
    })
}

// Застосування фільтрів
function applyFilters() {
    const categoryFilter = document.querySelector('#category-filter').value
    const sortFilter = document.querySelector('#sort-filter').value
    const searchInput = document.querySelector('#search-input').value.toLowerCase()

    // Фільтрація за категорією
    filteredProducts = allProducts.filter(product => {
        if (categoryFilter !== 'all' && product.category !== categoryFilter) {
            return false
        }
        return true
    })

    // Пошук за назвою
    if (searchInput) {
        filteredProducts = filteredProducts.filter(product => {
            return product.title.toLowerCase().includes(searchInput)
        })
    }

    // Сортування
    switch(sortFilter) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price)
            break
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price)
            break
        case 'name':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
            break
    }

    displayProducts(filteredProducts)
}

// Обработка URL параметров для поиска
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');
if (searchQuery) {
    document.querySelector('#search-input').value = searchQuery;
}

// Ініціалізація сторінки
getProducts().then(function(products) {
    allProducts = products
    filteredProducts = products
    window.allProducts = products

    // Заповнюємо фільтр категорій
    const categories = getCategories(products)
    populateCategoryFilter(categories)

    // Відображаємо всі товари
    displayProducts(products)

    // Если есть поисковый запрос из URL, применяем фильтры
    if (searchQuery) {
        applyFilters();
    }

    // Додаємо обробники для фільтрів
    document.querySelector('#category-filter').addEventListener('change', applyFilters)
    document.querySelector('#sort-filter').addEventListener('change', applyFilters)
    document.querySelector('#search-input').addEventListener('input', applyFilters)
    
    // Обновляем статус кнопок "Нравится"
    if (typeof favorites !== 'undefined') {
        favorites.updateUI();
    }
})