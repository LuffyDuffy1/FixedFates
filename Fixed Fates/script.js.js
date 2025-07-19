// Stripe Configuration
const stripe = Stripe('your-publishable-key'); // Replace with your actual Stripe publishable key
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Cart Items (For demo purposes, we will manually define products)
let cart = [
    { id: 1, name: 'T-Shirt', price: 1.99, quantity: 1 },
    { id: 2, name: 'Art Print', price: 9.99, quantity: 1 }
];

// Update the Cart Display
function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = ''; // Clear current cart content
    let total = 0;

    // If cart is empty, show the empty cart message
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
    }

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
        total += item.price * item.quantity;
    });

    document.getElementById('totalAmount').innerHTML = `<h3 class="text-uppercase">Total: $${total.toFixed(2)}</h3>`;
}

// Show the Checkout Form
function showCheckoutForm() {
    document.getElementById('checkoutForm').style.display = 'block';
    document.getElementById('checkoutButton').style.display = 'none'; // Hide the checkout button
}

// Process Checkout Form
function processCheckout(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    // Basic validation
    if (!name || !email || !address) {
        alert('Please fill in all fields!');
        return;
    }

    // Stripe Token Creation
    stripe.createToken(cardElement).then((result) => {
        if (result.error) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server (for the sake of simplicity, we'll just log it)
            console.log('Received Stripe Token:', result.token);

            // Simulate successful checkout
            alert(`Thank you for your purchase, ${name}! A confirmation has been sent to ${email}.`);

            // Reset the cart
            cart = [];
            updateCart();

            // Hide the checkout form after purchase
            document.getElementById('checkoutForm').style.display = 'none';
            document.getElementById('checkoutButton').style.display = 'block'; // Show checkout button again
        }
    });
}

// Add Item to Cart (Example)
function addItemToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
}

// Example: Adding a sample item (T-shirt) to the cart
addItemToCart({ id: 1, name: 'T-Shirt', price: 1.99 });
addItemToCart({ id: 2, name: 'Art Print', price: 9.99 });

// Initial call to update the cart on page load
updateCart();
