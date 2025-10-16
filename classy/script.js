document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the menu page by looking for the filter bar
    if (document.querySelector('.filter-bar')) {
        setupMenuPage();
    }

    // Check if we are on the product detail page
    if (document.querySelector('.product-page-container')) {
        populateProductDetails();
    }
});

// --- Function for Menu Page Filtering ---
function setupMenuPage() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const menuItems = document.querySelectorAll('.menu-item');
    const noResultsMessage = document.getElementById('no-results-message');

    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        let itemsFound = 0;

        menuItems.forEach(item => {
            const itemName = item.getAttribute('data-name').toLowerCase();
            const itemCategory = item.getAttribute('data-category');
            const matchesSearch = itemName.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;

            // The link is the parent of the item, so we show/hide the link
            const link = item.closest('.menu-item-link');
            if (matchesSearch && matchesCategory) {
                link.style.display = 'block';
                itemsFound++;
            } else {
                link.style.display = 'none';
            }
        });

        noResultsMessage.style.display = itemsFound === 0 ? 'block' : 'none';
    }

    searchInput.addEventListener('input', filterItems);
    categoryFilter.addEventListener('change', filterItems);
}


// --- Function for Dynamic Product Detail Page ---
async function populateProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.querySelector('.product-details-content').innerHTML = '<h1>Product not found!</h1>';
        return;
    }

    try {
        const response = await fetch('products.json');
        const products = await response.json();
        const product = products.find(p => p.id === productId);

        if (!product) {
            document.querySelector('.product-details-content').innerHTML = '<h1>Product not found!</h1>';
            return;
        }

        // Populate the page with data
        document.title = `${product.name} - Classy Bakes`;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-rating').textContent = product.rating;
        document.getElementById('product-reviews').textContent = product.reviews;
        document.getElementById('product-price').textContent = product.price;
        
        const mainImage = document.getElementById('main-product-image');
        mainImage.src = product.images.main;
        mainImage.alt = product.name;

        const thumbnailContainer = document.getElementById('thumbnail-container');
        thumbnailContainer.innerHTML = ''; // Clear old thumbnails

        product.images.thumbnails.forEach((thumbSrc, index) => {
            const img = document.createElement('img');
            img.src = thumbSrc;
            img.alt = `Thumbnail ${index + 1}`;
            if (index === 0) img.classList.add('active');

            // Add click event to change main image
            img.addEventListener('click', () => {
                mainImage.src = thumbSrc;
                // Update active state for thumbnails
                thumbnailContainer.querySelectorAll('img').forEach(i => i.classList.remove('active'));
                img.classList.add('active');
            });
            thumbnailContainer.appendChild(img);
        });

    } catch (error) {
        console.error('Failed to load product data:', error);
        document.querySelector('.product-details-content').innerHTML = '<h1>Error loading product data.</h1>';
    }
}