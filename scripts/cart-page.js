// Відображення кошика на сторінці
function displayCart() {
    const cartContent = document.querySelector('#cart-content')
    const emptyCart = document.querySelector('#empty-cart')
    const cartSummary = document.querySelector('#cart-summary')
    const totalItems = document.querySelector('#total-items')
    const totalPrice = document.querySelector('#total-price')

    // Перевіряємо чи є товари в кошику
    const itemCount = cart.getItemCount()
    
    if (itemCount === 0) {
        // Показуємо повідомлення про порожній кошик
        cartContent.innerHTML = ''
        emptyCart.style.display = 'block'
        cartSummary.style.display = 'none'
        return
    }

    // Ховаємо повідомлення про порожній кошик
    emptyCart.style.display = 'none'
    cartSummary.style.display = 'block'

    // Генеруємо HTML для товарів у кошику
    let cartHTML = '<div class="list-group">'
    
    for (let key in cart.items) {
        const item = cart.items[key]
        const itemTotal = item.price * item.quantity
        
        cartHTML += `
            <div class="list-group-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="img/${item.image}" class="img-fluid rounded" alt="${item.title}"
                             onerror="this.src='https://via.placeholder.com/100x100?text=Немає+зображення'">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${item.title}</h5>
                        <p class="text-muted mb-0">${item.description}</p>
                    </div>
                    <div class="col-md-2">
                        <p class="mb-0 fw-bold">${item.price} грн</p>
                    </div>
                    <div class="col-md-2">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary btn-sm quantity-btn" 
                                    data-action="decrease" data-id="${item.id}">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="number" class="form-control form-control-sm text-center quantity-input" 
                                   value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="btn btn-outline-secondary btn-sm quantity-btn" 
                                    data-action="increase" data-id="${item.id}">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <p class="mb-2 fw-bold text-primary">${itemTotal} грн</p>
                        <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}">
                            <i class="bi bi-trash"></i> Видалити
                        </button>
                    </div>
                </div>
            </div>
        `
    }
    
    cartHTML += '</div>'
    cartContent.innerHTML = cartHTML

    // Оновлюємо підсумок
    totalItems.textContent = itemCount
    totalPrice.textContent = `${cart.total} грн`

    // Додаємо обробники подій
    addCartEventListeners()
}

// Додавання обробників подій для кошика
function addCartEventListeners() {
    // Кнопки зміни кількості
    const quantityButtons = document.querySelectorAll('.quantity-btn')
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action')
            const itemId = parseInt(this.getAttribute('data-id'))
            const currentQuantity = cart.items[itemId].quantity

            if (action === 'increase') {
                cart.updateQuantity(itemId, currentQuantity + 1)
            } else if (action === 'decrease') {
                cart.updateQuantity(itemId, currentQuantity - 1)
            }
            
            displayCart()
        })
    })

    // Поля введення кількості
    const quantityInputs = document.querySelectorAll('.quantity-input')
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const itemId = parseInt(this.getAttribute('data-id'))
            const newQuantity = parseInt(this.value)
            
            if (newQuantity > 0) {
                cart.updateQuantity(itemId, newQuantity)
            } else {
                cart.removeItem(itemId)
            }
            
            displayCart()
        })
    })

    // Кнопки видалення
    const removeButtons = document.querySelectorAll('.remove-btn')
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'))
            
            if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
                cart.removeItem(itemId)
                displayCart()
            }
        })
    })
}

// Очищення кошика
const clearCartBtn = document.querySelector('#clear-cart')
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
        if (confirm('Ви впевнені, що хочете очистити весь кошик?')) {
            cart.clearCart()
            displayCart()
        }
    })
}

// Ініціалізація сторінки кошика
displayCart()