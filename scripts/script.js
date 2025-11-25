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
        <div class="col-md-4 mb-4">
            <div class="card h-100 product-card">
                <img src="img/${product.image}" class="card-img-top" alt="${product.title}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Немає+зображення'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <div class="mt-auto">
                        <p class="h5 text-primary mb-3">${product.price} грн</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary flex-grow-1 add-to-cart-btn" 
                                    data-product='${JSON.stringify(product)}'>
                                <i class="bi bi-cart-plus"></i> Купити
                            </button>
                            <a href="product.html?id=${product.id}" class="btn btn-outline-primary">
                                <i class="bi bi-eye"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Функція додавання товару до кошика
function addToCart(event) {
    const productData = event.target.getAttribute('data-product')
    const product = JSON.parse(productData)
    cart.addItem(product)
}

// Відображення товарів на головній сторінці (тільки перші 6)
getProducts().then(function(products) {
    const productsList = document.querySelector('#products-list')
    if (productsList) {
        // Показуємо тільки перші 6 товарів на головній
        const featuredProducts = products.slice(0, 6)
        
        featuredProducts.forEach(function(product) {
            productsList.innerHTML += getCardHTML(product)
        })

        // Додаємо обробники подій для кнопок "Купити"
        const buyButtons = document.querySelectorAll('.add-to-cart-btn')
        buyButtons.forEach(function(button) {
            button.addEventListener('click', addToCart)
        })
    }
})