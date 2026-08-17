// ==========================================
// Product Management Module
// ==========================================

class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.filteredProducts = [];
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.renderCategories();
            this.renderProductsByCategory();
        } catch (error) {
            console.error('Error initializing ProductManager:', error);
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Failed to load products');
            
            const data = await response.json();
            this.categories = data.categories;
            this.products = data.products;
            
            console.log(`Loaded ${this.products.length} products and ${this.categories.length} categories`);
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to hardcoded data
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        this.categories = [
            { id: 1, name: 'تي شيرتات', arabicName: 'تي شيرتات', icon: '👕' },
            { id: 2, name: 'بناطيل', arabicName: 'بناطيل', icon: '👖' }
        ];
        
        this.products = [
            {
                id: 101,
                categoryId: 1,
                name: 'تي شيرت أسود',
                arabicName: 'تي شيرت أسود كلاسيكي',
                price: 79,
                currency: 'ج.م',
                description: 'تي شيرت أسود من القطن 100%',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['أسود', 'أبيض'],
                inStock: true,
                rating: 4.5,
                reviews: 24
            },
            {
                id: 201,
                categoryId: 2,
                name: 'بنطال جينز أسود',
                arabicName: 'بنطال جينز أسود ضيق',
                price: 199,
                currency: 'ج.م',
                description: 'بنطال جينز عالي الجودة مريح',
                sizes: ['28', '30', '32', '34'],
                colors: ['أسود', 'أزرق'],
                inStock: true,
                rating: 4.6,
                reviews: 45
            }
        ];
    }

    renderCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = this.categories.map(category => `
            <div class="category-card" onclick="productManager.scrollToCategory(${category.id})">
                <div class="category-image">${category.icon}</div>
                <h3>${category.arabicName}</h3>
            </div>
        `).join('');
    }

    renderProductsByCategory() {
        // Render T-shirts
        const tshirtsGrid = document.getElementById('tshirtsGrid');
        if (tshirtsGrid) {
            const tshirts = this.products.filter(p => p.categoryId === 1);
            tshirtsGrid.innerHTML = this.renderProducts(tshirts);
        }

        // Render Pants
        const pantsGrid = document.getElementById('pantsGrid');
        if (pantsGrid) {
            const pants = this.products.filter(p => p.categoryId === 2);
            pantsGrid.innerHTML = this.renderProducts(pants);
        }
    }

    renderProducts(products) {
        return products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.categoryId === 1 ? '👕' : '👖'}
                    ${!product.inStock ? '<span class="product-badge">نفذ من المخزون</span>' : ''}
                </div>
                <div class="product-content">
                    <h3 class="product-name">${product.arabicName}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <span class="stars">${this.renderStars(product.rating)}</span>
                        <span>${product.rating} (${product.reviews} تقييم)</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${product.price} ${product.currency}</span>
                        <button class="add-to-cart" 
                                onclick="cartManager.addToCart(${product.id})"
                                ${!product.inStock ? 'disabled' : ''}>
                            أضف للسلة
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        return stars;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getProductsByCategory(categoryId) {
        return this.products.filter(p => p.categoryId === categoryId);
    }

    scrollToCategory(categoryId) {
        const categoryNames = {
            1: 'tshirts',
            2: 'pants'
        };
        const element = document.getElementById(categoryNames[categoryId]);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    filterProducts(query) {
        const lowerQuery = query.toLowerCase();
        this.filteredProducts = this.products.filter(product =>
            product.arabicName.includes(query) ||
            product.name.toLowerCase().includes(lowerQuery) ||
            product.description.includes(query)
        );
        return this.filteredProducts;
    }
}

// Initialize ProductManager
const productManager = new ProductManager();