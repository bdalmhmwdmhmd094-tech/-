// ==========================================
// Shopping Cart Management Module
// ==========================================

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartDisplay();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('tembish_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('tembish_cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    // Add product to cart
    addToCart(productId, quantity = 1) {
        if (!productManager) {
            console.error('ProductManager not initialized');
            return false;
        }

        const product = productManager.getProductById(productId);
        if (!product) {
            console.error('Product not found:', productId);
            return false;
        }

        // Check if product already in cart
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.arabicName,
                price: product.price,
                quantity: quantity,
                image: product.categoryId === 1 ? '👕' : '👖'
            });
        }

        this.saveCart();
        this.showNotification(`تم إضافة "${product.arabicName}" إلى السلة`);
        console.log(`Added ${quantity} of product ${productId} to cart`);
        
        return true;
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        console.log(`Removed product ${productId} from cart`);
    }

    // Update product quantity in cart
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Get total price
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total items count
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        if (confirm('هل تريد تفريغ السلة بالكامل؟')) {
            this.cart = [];
            this.saveCart();
            console.log('Cart cleared');
        }
    }

    // Update cart display
    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-size: 16px;
            font-weight: 500;
        `;
        notification.textContent = message;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        if (!document.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', '');
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Get cart items
    getCartItems() {
        return this.cart;
    }

    // Check if product is in cart
    isInCart(productId) {
        return this.cart.some(item => item.id === productId);
    }

    // Checkout (placeholder)
    checkout() {
        if (this.cart.length === 0) {
            alert('السلة فارغة');
            return false;
        }

        const total = this.getTotalPrice();
        const itemsCount = this.getTotalItems();
        
        // Show checkout summary
        const summary = `
ملخص الطلب:
- عدد المنتجات: ${itemsCount}
- الإجمالي: ${total} ج.م

هل تريد المتابعة؟
        `;

        if (confirm(summary)) {
            console.log('Proceeding to checkout with cart:', this.cart);
            this.showNotification('تم توجيهك لصفحة الدفع');
            // Here you would redirect to payment gateway
            return true;
        }
        return false;
    }
}

// Initialize CartManager
const cartManager = new CartManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}