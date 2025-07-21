// Enhanced product data with categories and ratings
const products = [
    {
        id: 1,
        name: "Classic Denim Jacket",
        price: 89.99,
        category: "women",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
        onSale: false,
        isNew: false
    },
    {
        id: 2,
        name: "Cotton T-Shirt",
        price: 24.99,
        category: "women",
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        onSale: true,
        originalPrice: 34.99,
        isNew: false
    },
    {
        id: 3,
        name: "Summer Dress",
        price: 79.99,
        category: "women",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
        onSale: false,
        isNew: true
    },
    {
        id: 4,
        name: "Leather Boots",
        price: 149.99,
        category: "accessories",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        onSale: false,
        isNew: false
    },
    {
        id: 5,
        name: "Wool Sweater",
        price: 69.99,
        category: "men",
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
        onSale: true,
        originalPrice: 89.99,
        isNew: false
    },
    {
        id: 6,
        name: "Casual Sneakers",
        price: 99.99,
        category: "men",
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        onSale: false,
        isNew: true
    },
    {
        id: 7,
        name: "Designer Handbag",
        price: 199.99,
        category: "accessories",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        onSale: false,
        isNew: false
    },
    {
        id: 8,
        name: "Silk Blouse",
        price: 89.99,
        category: "women",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
        onSale: true,
        originalPrice: 119.99,
        isNew: false
    }
];

// Shopping cart and filters
let cart = [];
let currentFilter = 'all';
let currentSort = 'featured';
let filteredProducts = [...products];

// DOM elements
const productGrid = document.getElementById('product-grid');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const closeModal = document.querySelector('.close');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const searchModal = document.getElementById('search-modal');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const searchIcon = document.querySelector('.fa-search');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartUI();
    initializeTheme();
    initializeFilters();
    initializeSearch();
    initializeNewsletter();
});

// Display products with enhanced features
function displayProducts(productsToShow = filteredProducts) {
    productGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1 / -1; padding: 3rem;">No products found matching your criteria.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const saleTag = product.onSale ? `<div class="sale-tag">Sale</div>` : '';
        const newTag = product.isNew ? `<div class="new-tag">New</div>` : '';
        const originalPrice = product.onSale ? `<span class="original-price">$${product.originalPrice}</span>` : '';
        const stars = generateStars(product.rating);
        
        productCard.innerHTML = `
            ${saleTag}
            ${newTag}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">${stars} <span class="rating-text">(${product.rating})</span></div>
                <div class="price-container">
                    <p class="product-price">$${product.price}</p>
                    ${originalPrice}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Filter functionality
function initializeFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.dataset.category;
            applyFilters();
        });
    });
    
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFilters();
    });
}

function applyFilters() {
    // Filter products
    if (currentFilter === 'all') {
        filteredProducts = [...products];
    } else if (currentFilter === 'sale') {
        filteredProducts = products.filter(product => product.onSale);
    } else {
        filteredProducts = products.filter(product => product.category === currentFilter);
    }
    
    // Sort products
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.isNew - a.isNew);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Featured - keep original order
            break;
    }
    
    displayProducts();
}

// Search functionality
function initializeSearch() {
    searchIcon.addEventListener('click', () => {
        searchModal.style.display = 'block';
        searchInput.focus();
    });
    
    searchClose.addEventListener('click', () => {
        searchModal.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    });
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        displaySearchResults(results);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No products found.</p>';
        return;
    }
    
    results.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="result-info">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
            </div>
            <button onclick="addToCart(${product.id}); closeSearchModal();">Add to Cart</button>
        `;
        searchResults.appendChild(resultItem);
    });
}

function closeSearchModal() {
    searchModal.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '';
}

// Newsletter functionality
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        showNotification('Thank you for subscribing!');
        e.target.reset();
    });
}

// Enhanced cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('Added to cart');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    displayCartItems();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
}

function displayCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price} × ${item.quantity}</p>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'var(--success-color)' : 'var(--accent-color)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 14px 20px;
        border-radius: 6px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        font-size: 0.875rem;
        font-family: var(--font-primary);
        letter-spacing: -0.01em;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    const icon = type === 'success' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-info"></i>';
    notification.innerHTML = `${icon} ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Theme toggle functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Event listeners
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    displayCartItems();
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

themeToggle.addEventListener('click', toggleTheme);

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTA button scroll to products
document.querySelector('.cta-button').addEventListener('click', () => {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
});

// Category card click handlers
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
        document.getElementById('products').scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// Add CSS animations and additional styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .sale-tag, .new-tag {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        z-index: 10;
    }
    
    .sale-tag {
        background: #dc2626;
        color: white;
    }
    
    .new-tag {
        background: var(--success-color);
        color: white;
        top: 3rem;
    }
    
    .product-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;
    }
    
    .product-rating .fas, .product-rating .far {
        color: #fbbf24;
        font-size: 0.75rem;
    }
    
    .rating-text {
        color: var(--text-secondary);
        font-size: 0.75rem;
    }
    
    .price-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.25rem;
    }
    
    .original-price {
        color: var(--text-muted);
        text-decoration: line-through;
        font-size: 0.875rem;
    }
    
    .search-result-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        transition: background 0.3s ease;
    }
    
    .search-result-item:hover {
        background: var(--bg-secondary);
    }
    
    .search-result-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
    }
    
    .result-info {
        flex: 1;
    }
    
    .result-info h4 {
        color: var(--text-primary);
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
    }
    
    .result-info p {
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .search-result-item button {
        background: var(--accent-color);
        color: var(--bg-primary);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .cart-item-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
    }
    
    .cart-item-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
    }
    
    .remove-btn {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .remove-btn:hover {
        background: #dc2626;
        color: white;
        border-color: #dc2626;
    }
`;
document.head.appendChild(style);