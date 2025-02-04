


// Cart state
        let cartItems = [];
        
        // DOM Elements
        const cartDiv = document.getElementById('cartDiv');
        const cartContainer = document.getElementById('cartContainer');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        const orderMessage = document.getElementById('orderMessage');

        // Add to cart functionality
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price),
                    image: button.dataset.image,
                    quantity: 1
                };

                addToCart(product);
                updateCartUI();
                animateCartIcon();
            });
        });

        // Cart icon click handler
        cartDiv.addEventListener('click', openCart);

        function addToCart(product) {
            const existingItem = cartItems.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push(product);
            }
        }

        function updateQuantity(productId, delta) {
            const item = cartItems.find(item => item.id === productId);
            if (item) {
                item.quantity += delta;
                if (item.quantity <= 0) {
                    cartItems = cartItems.filter(item => item.id !== productId);
                }
                updateCartUI();
            }
        }

        function updateCartUI() {
            // Update cart counter
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartDiv.setAttribute('data-totalitems', totalItems);

            // Update cart items
            cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="flex items-center justify-between py-4 border-b border-gray-700">
                    <div class="flex items-center gap-4">
                        <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover">
                        <div>
                            <h3 class="text-lg font-medium">${item.name}</h3>
                            <p class="text-gray-300">$${item.price}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="updateQuantity('${item.id}', -1)" class="bg-gray-600 text-white w-8 h-8 rounded">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" class="bg-gray-600 text-white w-8 h-8 rounded">+</button>
                    </div>
                </div>
            `).join('');

            // Update total
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalElement.textContent = `$${total}`;
        }

        function animateCartIcon() {
            cartDiv.classList.add('shake');
            setTimeout(() => cartDiv.classList.remove('shake'), 500);
        }

        function openCart() {
            cartContainer.classList.remove('hidden');
            cartContainer.classList.add('slide-in');
        }

        function closeCart() {
            cartContainer.classList.add('hidden');
            cartContainer.classList.remove('slide-in');
        }

        function handleCheckout() {
            if (cartItems.length === 0) return;

            // Clear cart
            cartItems = [];
            updateCartUI();
            closeCart();

            // Show success message
            orderMessage.classList.remove('hidden');
            setTimeout(() => {
                orderMessage.classList.add('hidden');
            }, 3000);
        }
    