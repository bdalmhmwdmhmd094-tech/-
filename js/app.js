// ==========================================
// Main Application Module
// ==========================================

class TembishApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSearch();
        console.log('Tembish App initialized');
    }

    setupEventListeners() {
        // Cart button
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.openCart());
        }

        // CTA button
        const ctaBtn = document.querySelector('.cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                const productsSection = document.querySelector('.products-section');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                
                const target = link.getAttribute('href');
                if (target.startsWith('#')) {
                    const element = document.querySelector(target);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    setupSearch() {
        const searchBox = document.querySelector('.search-box');
        if (!searchBox) return;

        let searchTimeout;
        searchBox.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            searchTimeout = setTimeout(() => {
                if (query.length > 0) {
                    this.performSearch(query);
                } else {
                    // Reset to show all products
                    productManager.renderProductsByCategory();
                }
            }, 300);
        });
    }

    performSearch(query) {
        if (!productManager) {
            console.error('ProductManager not available');
            return;
        }

        const results = productManager.filterProducts(query);
        
        // Clear previous grids
        const tshirtsGrid = document.getElementById('tshirtsGrid');
        const pantsGrid = document.getElementById('pantsGrid');

        if (results.length === 0) {
            if (tshirtsGrid) tshirtsGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 40px;">لا توجد نتائج لـ: ' + query + '</p>';
            if (pantsGrid) pantsGrid.innerHTML = '';
            return;
        }

        // Group results by category
        const tshirts = results.filter(p => p.categoryId === 1);
        const pants = results.filter(p => p.categoryId === 2);

        if (tshirtsGrid) {
            tshirtsGrid.innerHTML = tshirts.length > 0 ? 
                productManager.renderProducts(tshirts) : 
                '';
        }

        if (pantsGrid) {
            pantsGrid.innerHTML = pants.length > 0 ? 
                productManager.renderProducts(pants) : 
                '';
        }

        console.log(`Search results: ${results.length} items found`);
    }

    openCart() {
        if (cartManager.cart.length === 0) {
            alert('السلة فارغة');
            return;
        }

        this.showCartModal();
    }

    showCartModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            direction: rtl;
        `;

        const cartItems = cartManager.getCartItems();
        const total = cartManager.getTotalPrice();
        const totalItems = cartManager.getTotalItems();

        const itemsHTML = cartItems.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
                    <div style="color: #666; font-size: 14px;">السعر: ${item.price} ج.م</div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="number" value="${item.quantity}" min="1" max="10"
                           onchange="cartManager.updateQuantity(${item.id}, this.value); app.updateCartDisplay();"
                           style="width: 50px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; text-align: center;">
                    <button onclick="cartManager.removeFromCart(${item.id}); app.updateCartDisplay();" 
                            style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                        حذف
                    </button>
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto;">
                <div style="padding: 20px; border-bottom: 2px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; color: #D4A574;">سلتي</h2>
                    <button onclick="document.getElementById('cartModal').remove();" 
                            style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                </div>
                
                <div style="padding: 20px;">
                    ${itemsHTML}
                    
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                            <span style="font-size: 16px; color: #666;">عدد المنتجات:</span>
                            <span style="font-size: 16px; font-weight: 600;">${totalItems} منتج</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                            <span style="font-size: 18px; font-weight: 600; color: #333;">الإجمالي:</span>
                            <span style="font-size: 24px; font-weight: bold; color: #D4A574;">${total.toFixed(2)} ج.م</span>
                        </div>
                    </div>
                </div>

                <div style="padding: 20px; border-top: 1px solid #eee; display: flex; gap: 10px;">
                    <button onclick="cartManager.checkout();"
                            style="flex: 1; background: #D4A574; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        متابعة الشراء
                    </button>
                    <button onclick="cartManager.clearCart(); app.updateCartDisplay(); document.getElementById('cartModal').remove();"
                            style="flex: 1; background: #f44336; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        تفريغ السلة
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    updateCartDisplay() {
        if (cartManager.cart.length === 0) {
            document.getElementById('cartModal')?.remove();
        } else {
            document.getElementById('cartModal')?.remove();
            this.showCartModal();
        }
    }

    // Performance optimization: Lazy load images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Performance optimization: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Analytics: Track user actions
    trackEvent(eventName, eventData = {}) {
        console.log(`Event: ${eventName}`, eventData);
        // Here you would send to analytics service
    }
}

// Initialize app
const app = new TembishApp();

// Log when page is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, Tembish store is ready');
    // Verify all modules are loaded
    if (typeof productManager !== 'undefined' && typeof cartManager !== 'undefined') {
        console.log('✓ All modules loaded successfully');
    }
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App backgrounded');
    } else {
        console.log('App restored');
    }
});