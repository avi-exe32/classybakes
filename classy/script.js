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
a// --- Function for Dynamic Product Detail Page ---
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

        // Populate the page with basic product data (existing code)
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

        // NEW: Populate Description Tabs content
        if (product.details) {
            document.getElementById('description-content').innerHTML = product.details.description;
            document.getElementById('quality_care-content').innerHTML = product.details.quality_care;
            document.getElementById('reviews_content-content').innerHTML = product.details.reviews_content;
            document.getElementById('tab-reviews-count').textContent = product.reviews; // Update reviews count in tab header
        } else {
            // Hide the entire tab section if no details are available
            document.querySelector('.product-info-section').style.display = 'none';
        }

        // NEW: Add event listeners for tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // Add active class to the clicked button
                button.classList.add('active');

                // Show the corresponding tab pane
                const targetTab = button.getAttribute('data-tab');
                document.getElementById(`${targetTab}-content`).classList.add('active');
            });
        });

    } catch (error) {
        console.error('Failed to load product data or populate details:', error);
        document.querySelector('.product-details-content').innerHTML = '<h1>Error loading product data.</h1>';
    }
}