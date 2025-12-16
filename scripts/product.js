// Отримання ID товару з URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search)
    return parseInt(urlParams.get('id'))
}

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

// Пошук товару за ID
function findProductById(products, id) {
    return products.find(product => product.id === id)
}

// Відображення деталей товару
function displayProductDetails(product) {
    const productDetails = document.querySelector('#product-details')
    const breadcrumbTitle = document.querySelector('#breadcrumb-title')
    
    if (!product) {
        productDetails.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>Товар не знайдено</h3>
                <a href="products.html" class="btn btn-primary mt-3">Повернутися до каталогу</a>
            </div>
        `
        return
    }

    // Оновлюємо заголовок breadcrumb
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = product.title
    }

    // Оновлюємо title сторінки
    document.title = `${product.title} - Мій Магазин`

    // Відображаємо деталі товару
    productDetails.innerHTML = `
        <div class="col-md-6">
            <img src="img/${product.image}" class="img-fluid rounded" alt="${product.title}"
                 onerror="this.src='https://via.placeholder.com/500x500?text=Немає+зображення'">
        </div>
        <div class="col-md-6">
            <h1 class="mb-3">${product.title}</h1>
            <p class="text-muted mb-3">
                <i class="bi bi-tag"></i> ${product.category || 'Без категорії'}
            </p>
            <p class="lead mb-4">${product.fullDescription || product.description}</p>
            
            <div class="card mb-4">
                <div class="card-body">
                    <h3 class="text-primary mb-3">${product.price} грн</h3>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-lg" id="add-to-cart-btn" 
                                data-product='${JSON.stringify(product)}'>
                            <i class="bi bi-cart-plus"></i> Додати до кошика
                        </button>
                        <a href="products.html" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i> Повернутися до каталогу
                        </a>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Характеристики</h5>
                    <ul class="list-unstyled mb-0">
                        <li><i class="bi bi-check-circle text-success"></i> Офіційна гарантія</li>
                        <li><i class="bi bi-check-circle text-success"></i> Безкоштовна доставка</li>
                        <li><i class="bi bi-check-circle text-success"></i> Обмін та повернення</li>
                    </ul>
                </div>
            </div>
        </div>
    `

    // Додаємо обробник для кнопки "Додати до кошика"
    const addToCartBtn = document.querySelector('#add-to-cart-btn')
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(event) {
            const productData = event.target.getAttribute('data-product')
            const product = JSON.parse(productData)
            cart.addItem(product)
        })
    }
}

// Ініціалізація сторінки товару
const productId = getProductIdFromURL()

if (productId) {
    getProducts().then(function(products) {
        const product = findProductById(products, productId)
        displayProductDetails(product)
        
        // Обновляем статус кнопок "Нравится"
        if (typeof favorites !== 'undefined') {
            favorites.updateUI();
        }
    })
} else {
    // Якщо ID не вказано, показуємо помилку
    const productDetails = document.querySelector('#product-details')
    productDetails.innerHTML = `
        <div class="col-12 text-center py-5">
            <h3>Товар не знайдено</h3>
            <a href="products.html" class="btn btn-primary mt-3">Повернутися до каталогу</a>
        </div>
    `
}