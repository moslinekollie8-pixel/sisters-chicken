 // Sister's Chicken - WhatsApp Ordering

const whatsappNumbers = [
    "231775478670",
    "231778003129"
];

// Shopping Cart System

let cart = [];

const foodButtons = document.querySelectorAll(".order-item");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const checkoutButton = document.getElementById("checkout-button");

// Add food to cart

foodButtons.forEach(button => {
    button.addEventListener("click", function() {

        const foodName = this.dataset.item;

        const quantityInput = this
            .closest(".menu-card")
            .querySelector(".item-quantity");

        const quantity = Number(quantityInput.value);

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
            alert("Please select a quantity between 1 and 20.");
            return;
        }

        const existingItem = cart.find(item => item.name === foodName);

        if (existingItem) {
            if (existingItem.quantity + quantity > 20) {
                alert("Maximum quantity per item is 20.");
                return;
            }

            existingItem.quantity += quantity;
        } else {
            cart.push({
                name: foodName,
                quantity: quantity
            });
        }

        updateCart();
    });
});

// Display cart

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your basket is currently empty.</p>';
    }

    cart.forEach((item, index) => {

        const cartRow = document.createElement("div");

        cartRow.className = "cart-item";

        cartRow.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <p>Quantity: ${item.quantity}</p>
            </div>

            <button onclick="removeItem(${index})">Remove</button>
        `;

        cartItems.appendChild(cartRow);
    });

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    cartCount.textContent = totalItems;
}

// Remove item

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Show delivery address only when Delivery is selected

const orderType = document.getElementById("order-type");
const deliveryAddressBox = document.getElementById("delivery-address-box");

orderType.addEventListener("change", function() {

    if (this.value === "Delivery") {
        deliveryAddressBox.hidden = false;
    } else {
        deliveryAddressBox.hidden = true;
    }

});

// Show delivery address only when Delivery is selected


// WhatsApp Checkout

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Your basket is empty. Please add something first.");
        return;
    }

    const customerName = document.getElementById("customer-name").value.trim();
    const customerPhone = document.getElementById("customer-phone").value.trim();
    const orderType = document.getElementById("order-type").value;
    const deliveryAddress = document.getElementById("delivery-address").value.trim();

    if (!customerName || !customerPhone || !orderType) {
        alert("Please complete your name, phone number and order type.");
        return;
    }

    if (orderType === "Delivery" && !deliveryAddress) {
        alert("Please enter your delivery address.");
        return;
    }

    const choice = prompt(
        "Choose where to send your order:\n\n" +
        "1. 0775478670\n" +
        "2. 0778003129\n\n" +
        "Enter 1 or 2:"
    );

    if (choice !== "1" && choice !== "2") {
        alert("Please enter 1 or 2 to select a WhatsApp number.");
        return;
    }

    const selectedNumber = whatsappNumbers[Number(choice) - 1];

    let message = "Hello Sister's Chicken! I would like to place an order:\n\n";

    message += "CUSTOMER DETAILS\n";
    message += `Name: ${customerName}\n`;
    message += `Phone: ${customerPhone}\n`;
    message += `Order Type: ${orderType}\n`;

    if (orderType === "Delivery") {
        message += `Delivery Address: ${deliveryAddress}\n`;
    }

    message += "\nMY ORDER\n";

    cart.forEach(item => {
        message += `${item.name} - ${item.quantity} portion(s)\n`;
    });

    message += "\nThank you!";

    const whatsappLink =
        `https://wa.me/${selectedNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappLink, "_blank");
});
