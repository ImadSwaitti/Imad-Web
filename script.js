$(document).ready(function () {
    const apiUrl = "products.json"; // Replace with your JSON file path
    let allProducts = []; // To store the fetched products
    let cart = []; // To store cart items
    let wishlist = []; // To store wishlist items

    // Function to load and filter products dynamically
    function loadProducts(category = "all", searchQuery = "", filterWishlist = false) {
        const productGrid = $("#product-grid");
        productGrid.empty(); // Clear existing products

        let filteredProducts = allProducts.filter(product => {
            const matchesCategory = category === "all" || product.category === category;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filterWishlist) {
            filteredProducts = filteredProducts.filter(product => wishlist.includes(product.name));
        }

        if (filteredProducts.length === 0) {
            productGrid.append("<p>No products found.</p>");
        } else {
            filteredProducts.forEach(product => {
                const isInWishlist = wishlist.includes(product.name);
                const productCard = `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">${product.price}</p>
                        <button class="add-to-cart" data-product-name="${product.name}">Add to Cart</button>
                        <button class="view-detailss" data-product-name="${product.name}">View Details</button>
                        <button class="wishlist ${isInWishlist ? "active" : ""}" data-product-name="${product.name}">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                `;
                productGrid.append(productCard);
            });
        }
    }

    // Fetch products from the JSON file
    function fetchProducts() {
        $.ajax({
            url: apiUrl,
            method: "GET",
            dataType: "json",
            success: function (data) {
                allProducts = data; // Store fetched products
                loadProducts(); // Load all products initially
            },
            error: function () {
                alert("Failed to load products. Please try again later.");
            }
        });
    }

// Add product to cart
function addToCart(productName) {
    const product = allProducts.find(p => p.name === productName);
    if (product) {
        // Check if the product is already in the cart
        const existingCartItem = cart.find(item => item.name === productName);
        if (existingCartItem) {
            existingCartItem.quantity += 1; // Increase the quantity
        } else {
            product.quantity = 1; // Set initial quantity to 1
            cart.push(product); // Add product to the cart
        }
        updateCart();
    }
}


    // Remove product from cart
    function removeFromCart(index) {
        cart.splice(index, 1); // Remove item at the specified index
        updateCart();
    }

    // Reset the cart
    function resetCart() {
        cart = []; // Clear all items from the cart
        updateCart();
    }

    // Update cart display
// Update cart display
function updateCart() {
    const cartItems = $("#cart-items");
    const cartTotal = $("#cart-total");
    const cartCount = $("#cart-count");

    cartItems.empty();

    if (cart.length === 0) {
        cartItems.html("<p>Your cart is empty.</p>");
        cartTotal.html("<p>Total: $0.00</p>");
        cartCount.text(0); // Update cart count to 0
    } else {
        let total = 0;
        let totalQuantity = 0; // To calculate total quantity of items

        cart.forEach((item, index) => {
            if (!item.quantity) {
                item.quantity = 1; // Default quantity if not set
            }

            total += parseFloat(item.price.replace("$", "")) * item.quantity;
            totalQuantity += item.quantity; // Accumulate the quantity

            cartItems.append(`
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <span>${item.name}</span>
                        <span class="cart-item-price">${item.price}</span>
                        <div class="quantity-control">
                            <button class="decrease-quantity" data-index="${index}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="increase-quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `);
        });

        cartTotal.html(`
            <p>Total: $${total.toFixed(2)}</p>
            <button class="buy-now">Buy</button>
        `);

        cartCount.text(totalQuantity); // Update cart icon count
    }
}


// Handle quantity increase
$("#cart-items").off("click", ".increase-quantity").on("click", ".increase-quantity", function () {
    const index = $(this).data("index");
    cart[index].quantity += 1; // Increment by 1
    updateCart();
});

// Handle quantity decrease
$("#cart-items").off("click", ".decrease-quantity").on("click", ".decrease-quantity", function () {
    const index = $(this).data("index");
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1; // Decrement by 1
        updateCart();
    } else {
        removeFromCart(index); // Remove item if quantity is 1
    }
});
    // Toggle wishlist item
    function toggleWishlist(productName) {
        const index = wishlist.indexOf(productName);
        if (index === -1) {
            wishlist.push(productName); // Add to wishlist
        } else {
            wishlist.splice(index, 1); // Remove from wishlist
        }
        updateWishlistCount();
        loadProducts(); // Re-render the products to update heart icon
    }

    // Update wishlist count
    function updateWishlistCount() {
        $("#wishlist-count").text(wishlist.length);
    }

    // Toggle cart modal visibility
    function toggleCartModal() {
        $("#cart-modal").toggleClass("hidden");
        if ($("#cart-modal").hasClass("hidden")) {
            $("#cart-modal").fadeOut();
        } else {
            $("#cart-modal").fadeIn();
        }
    }

    // Open modal with product details
    function openModal(product) {
        $("#modal-image").attr("src", product.image);
        $("#modal-name").text(product.name);
        $("#modal-description").text(product.description);
        $("#modal-price").text(product.price);
        $("#modal-rating").text(`Rating: ${product.rating || "N/A"}/5`);
        $("#product-modal").fadeIn();
    }
    // Close modal
    $(".close").click(function () {
        $("#product-modal").fadeOut();
    });

    // Handle Add to Cart button clicks
    $("#product-grid").on("click", ".add-to-cart", function () {
        const productName = $(this).data("product-name");
        addToCart(productName);
    });

    // Handle Wishlist button clicks
    $("#product-grid").on("click", ".wishlist", function () {
        const productName = $(this).data("product-name");
        toggleWishlist(productName);
    });

    // Handle Wishlist Icon Click
    $("#wishlist-icon").click(function () {
        loadProducts("all", "", true); // Filter products to show only wishlist items
    });

    // Handle cart icon click
    $("#cart-icon").click(function () {
        toggleCartModal();
    });

    // Close cart modal
    $(".close-cart").click(function () {
        toggleCartModal();
    });

    // Handle remove button clicks
    $("#cart-items").on("click", ".remove-item", function () {
        const index = $(this).data("index");
        removeFromCart(index);
    });

// Handle Buy button click
$("#cart-total").on("click", ".buy-now", function () {
    // Display a confirmation dialog
    const confirmationDialog = `
        <div id="confirm-purchase" class="confirmation-modal">
            <div class="confirmation-content">
                <h2>Confirm Purchase</h2>
                <p>Are you sure you want to complete your purchase?</p>
                <div class="confirmation-actions">
                    <button id="confirm-yes" class="confirm-yes">Yes</button>
                    <button id="confirm-no" class="confirm-no">No</button>
                </div>
            </div>
        </div>
    `;

    // Append the confirmation dialog to the body
    $("body").append(confirmationDialog);

    // Handle Yes button click
    $("#confirm-yes").on("click", function () {
        // Remove confirmation dialog
        $("#confirm-purchase").remove();

        // Show thank-you message
        const thankYouMessage = `
            <div id="purchase-confirmation" class="confirmation-modal">
                <div class="confirmation-content">
                    <h2>Thank You for Your Purchase!</h2>
                    <p>Your order has been successfully placed. We will process it shortly.</p>
                    <button id="close-confirmation" class="close-confirmation">Close</button>
                </div>
            </div>
        `;
        $("body").append(thankYouMessage);

        // Close the thank-you message
        $("#close-confirmation").on("click", function () {
            $("#purchase-confirmation").remove();
        });

        // Reset the cart after purchase
        resetCart();
    });

    // Handle No button click
    $("#confirm-no").on("click", function () {
        // Remove confirmation dialog
        $("#confirm-purchase").remove();
    });
});


    // Handle "View Details" button clicks
    $("#product-grid").on("click", ".view-detailss", function () {
        const productName = $(this).data("product-name");
        const product = allProducts.find(p => p.name === productName);
        if (product) openModal(product);
    });

    // Tab click event listener for category filtering
    $(".tabs").on("click", ".tab-button", function () {
        $(".tab-button").removeClass("active"); // Remove active class from all tabs
        $(this).addClass("active"); // Add active class to the clicked tab

        const category = $(this).data("category"); // Get category from data attribute
        const searchQuery = $("#search").val(); // Get the current search input value
        loadProducts(category, searchQuery); // Load products based on category and search
    });

    // Search input event listener
    $("#search").on("input", function () {
        const searchQuery = $(this).val(); // Get the current search input value
        const activeCategory = $(".tab-button.active").data("category"); // Get the active category
        loadProducts(activeCategory, searchQuery); // Load products based on search and active category
    });

    // Fetch and display products on page load
    fetchProducts();
});
