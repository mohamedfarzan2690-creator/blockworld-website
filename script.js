

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedProduct = null;

function buyProduct(productName, price) {

    const existingProduct = cart.find(function (product) {
        return product.name === productName;
    });

    if (existingProduct) {
        existingProduct.quantity = existingProduct.quantity + 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    displayCart();
    showCartNotification();
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    let total = 0;

    cart.forEach(function (product) {

        const item = document.createElement("p");

        item.textContent =
            product.name +
            " - ₹" +
            product.price +
            " × " +
            product.quantity;

        const addButton = document.createElement("button");

        addButton.textContent = "+";

        addButton.onclick = function () {
            buyProduct(product.name, product.price);
        };

        item.appendChild(addButton);
        const removeButton = document.createElement("button");

        removeButton.textContent = "−";

        removeButton.onclick = function () {
            removeProduct(product.name);
        };

        item.appendChild(removeButton);
        cartItems.appendChild(item);

        total = total + (product.price * product.quantity);

    });

    cartTotal.textContent = total;
    let totalQuantity = 0;

    cart.forEach(function (product) {
        totalQuantity = totalQuantity + product.quantity;
    });

    cartCount.textContent = totalQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));
}
function removeProduct(productName) {
    const productIndex = cart.findIndex(function (product) {
        return product.name === productName;
    });

    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity =
                cart[productIndex].quantity - 1;
        } else {
            cart.splice(productIndex, 1);
        }
    }

    displayCart();
}

function clearCart() {
    cart = [];
    displayCart();
}
function showProductDetails(name, price, description) {
    selectedProduct = {
        name: name,
        price: price
    };

    document.getElementById("modal-title").textContent = name;
    document.getElementById("modal-price").textContent = price;
    document.getElementById("modal-description").textContent = description;

    document.getElementById("modal-quantity").value = 1;

    document.getElementById("product-modal").style.display = "flex";
}

function closeProductDetails() {
    document.getElementById("product-modal").style.display = "none";
}


function addModalProductToCart() {
    const quantity = Number(
        document.getElementById("modal-quantity").value
    );

    if (quantity < 1 || quantity > 10 || !Number.isInteger(quantity)) {
        alert("Please enter a quantity between 1 and 10.");
        return;
    }

    for (let i = 0; i < quantity; i++) {
        buyProduct(selectedProduct.name, selectedProduct.price);
    }

    closeProductDetails();
}
function showCartNotification() {
    const notification =
        document.getElementById("cart-notification");

    notification.classList.add("show");

    setTimeout(function () {
        notification.classList.remove("show");
    }, 1500);
}
function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add a product before checkout.");
        return;
    }

    const checkout = document.getElementById("checkout");

    checkout.style.display = "block";
    displayOrderSummary();

    checkout.scrollIntoView({
        behavior: "smooth"
    });
}
const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const customerName =
        document.getElementById("customer-name").value.trim();

    const customerEmail =
        document.getElementById("customer-email").value.trim();

    const customerPhone =
        document.getElementById("customer-phone").value.trim();

    const customerAddress =
        document.getElementById("customer-address").value.trim();

    const orderNumber =
        "BW-" + Date.now();

    document.getElementById("confirmation-name").textContent =
        customerName;

    document.getElementById("order-number").textContent =
        orderNumber;

    document.getElementById("order-confirmation").style.display =
        "block";

    cart = [];
    displayCart();

    checkoutForm.reset();

    document.getElementById("order-summary").style.display =
        "none";
});

function displayOrderSummary() {
    const summaryItems =
        document.getElementById("summary-items");

    const summaryTotal =
        document.getElementById("summary-total");

    summaryItems.innerHTML = "";

    let total = 0;

    cart.forEach(function (product) {
        const item = document.createElement("p");

        item.textContent =
            product.name +
            " — ₹" +
            product.price +
            " × " +
            product.quantity;

        summaryItems.appendChild(item);

        total = total +
            (product.price * product.quantity);
    });

    summaryTotal.textContent = total;
}
displayCart();