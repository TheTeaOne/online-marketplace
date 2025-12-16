class FavoriteList {
    constructor() {
        this.items = this.loadFavorites() || {}
    }

    loadFavorites() {
        return JSON.parse(localStorage.getItem("favorites")) || {}
    }

    saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(this.items))
    }

    add(item) {
        this.items[item.id] = item;
        this.saveFavorites()
        this.updateUI()
    }

    remove(id) {
        delete this.items[id]
        this.saveFavorites()
        this.updateUI()
    }

    isFavorite(id) {
        return this.items.hasOwnProperty(id)
    }

    getAll() {
        return Object.values(this.items)
    }

    updateUI() {
        // Обновляем контейнер с избранными товарами (на странице favorite)
        const container = document.querySelector(".favorite-container")
        if (container) {
            const favItems = this.getAll()
            if (favItems.length === 0) {
                container.innerHTML = "<p>Список бажаного порожній</p>"
            } else {
                container.innerHTML = favItems.map(item => `
                    <div class="favorite-card product-card">
                        <div class="fav-left">
                            <img src="img/${item.image}" alt="${item.title}" class="fav-img-img" />
                        </div>
                        <div class="fav-right">
                            <h3>${item.title}</h3>
                            <p class="product-desc">${item.description || ''}</p>
                            <p class="product-price">${item.price} грн</p>
                            <div class="fav-actions">
                                <button class="buy-btn" data-product-id="${item.id}">Купити</button>
                                <button class="remove-fav" data-id="${item.id}">Видалити</button>
                            </div>
                        </div>
                    </div>
                `).join("")
            }
        }

        if (!window.allProducts) return; // Ждем загрузки товаров для кнопок
        // Обновляем все кнопки на странице
        document.querySelectorAll(".favorite-btn").forEach(btn => {
            const productId = parseInt(btn.dataset.productId);
            const product = window.allProducts.find(p => p.id === productId);
            if (product && this.isFavorite(product.id)) {
                btn.classList.add("active")
            } else {
                btn.classList.remove("active")
            }
        })
    }
}

const favorites = new FavoriteList()

document.addEventListener("click", (e) => {
    // Нажатие на кнопку фаворита (в карточках)
    const favBtn = e.target.closest(".favorite-btn")
    if (favBtn) {
        const productId = parseInt(favBtn.dataset.productId);
        const product = window.allProducts.find(p => p.id === productId);
        if (product) {
            if (favorites.isFavorite(product.id)) {
                favorites.remove(product.id)
            } else {
                favorites.add(product)
            }
        }
        return
    }

    // Удаление из избранного на странице favorites
    const removeBtn = e.target.closest('.remove-fav')
    if (removeBtn) {
        const id = removeBtn.dataset.id
        favorites.remove(id)
        return
    }

    // Кнопка "Купити" в списке избранного
    const buyBtn = e.target.closest('.favorite-container .buy-btn') || (e.target.closest('.buy-btn') && e.target.closest('.favorite-container'))
    if (buyBtn) {
        const productId = parseInt(buyBtn.dataset.productId);
        const product = window.allProducts.find(p => p.id === productId);
        if (product && typeof cart !== 'undefined') {
            cart.addItem(product)
        } else {
            console.warn('Cart is not available or product not found')
        }
        return
    }
})

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
        favorites.updateUI()
    })
} else {
    // Если скрипт загружается после DOMContentLoaded
    setTimeout(() => favorites.updateUI(), 0)
}
