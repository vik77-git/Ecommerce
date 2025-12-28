// Initialize Cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update Cart Count in Navbar
function updateCartCount() {
  let cart = getCart();
  document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Add item to Cart
function addToCart(product, price) {
  let cart = getCart();

  let existingItem = cart.find(item => item.product === product);
  if (existingItem) {
    existingItem.quantity += 1; // Increase quantity
  } else {
    cart.push({ product, price, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();

  Swal.fire({
    icon: "success",
    title: `${product} Added to Cart ✅`,
    showConfirmButton: false,
    timer: 1500
  });
}

// Display Cart Items in `cart.html`
function displayCart() {
  let cart = getCart();
  let cartList = document.getElementById("cart-list");
  let totalPrice = document.getElementById("total-price");

  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your Cart is Empty</p>";
  } else {
    cart.forEach((item, index) => {
      let div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <p><strong>${item.product}</strong> - ₹${item.price} x ${item.quantity}</p>
        <button onclick="increaseQuantity(${index})">+</button>
        <button onclick="decreaseQuantity(${index})">-</button>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      `;
      cartList.appendChild(div);
      total += item.price * item.quantity;
    });
  }

  totalPrice.innerText = `Total: ₹ ${total}`;
}

// Increase item quantity
function increaseQuantity(index) {
  let cart = getCart();
  cart[index].quantity += 1;
  saveCart(cart);
  displayCart();
}

// Decrease item quantity
function decreaseQuantity(index) {
  let cart = getCart();
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  saveCart(cart);
  displayCart();
}

// Remove item from cart
function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  displayCart();
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
}

// Check Page URL and Display Cart
if (window.location.pathname.includes("cart.html")) {
  displayCart();
}

// Update cart count on page load
document.addEventListener("DOMContentLoaded", updateCartCount);
function validateCardInput(input) {
  input.value = input.value.replace(/\D/g, '').slice(0, 16);
}
// download after purchase
setTimeout(() => {
  popup.style.display = "none";
  window.location.href = "download.html"; // Redirect to download page
}, 3000);
// search using search icon
function searchProducts() {
  let query = document.getElementById("search-bar").value.toLowerCase();
  let resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";

  let products = [
    { name: "Gift cards", link: "gift_card.html" },
    { name: "Greeting cards", link: "greeting_card.html" },
    { name: "Wedding cards", link: "wedding_card.html" },
    { name: "Farewell", link: "farewell.html" },
    { name: "ebooks", link: "ebook.html" }
  ];

  let filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  if (filteredProducts.length > 0) {
    resultsContainer.style.display = "block";
  } else {
    resultsContainer.style.display = "none";
  }

  filteredProducts.forEach(product => {
    let li = document.createElement("li");
    li.innerHTML = `<a href="${product.link}">${product.name}</a>`;
    resultsContainer.appendChild(li);
  });
}

// Hide search results when clicking outside
document.addEventListener("click", function(event) {
  let searchContainer = document.querySelector(".search-container");
  let resultsContainer = document.getElementById("search-results");

  if (!searchContainer.contains(event.target)) {
    resultsContainer.style.display = "none";
  }
  fetch("http://localhost:3000")
  .then(response => response.json())
  .then(data => {
    console.log(data); // See the response in the console
  })
  .catch(error => console.error("Error fetching products:", error));
});
//search functionality 
// Sample product data
// Sample product data
const products = [
  { name: "Greeting Card", price: 150, image: "Greeting Card.jfif" },
  { name: "Birthday Card", price: 120, image: "Birthday Card.jfif" },
  { name: "Wedding Card", price: 120, image: "Wedding Card.jfif" }
];

function searchProducts(event) {
  let input = document.getElementById("search-bar").value.toLowerCase();
  let resultsContainer = document.getElementById("search-results");

  resultsContainer.innerHTML = ""; // Clear previous results
  
  if (input === "") {
      resultsContainer.style.display = "none"; // Hide results if input is empty
      return;
  }

  let filteredProducts = products.filter(product => product.name.toLowerCase().includes(input));

  if (filteredProducts.length === 0) {
      resultsContainer.innerHTML = "<li>No results found</li>";
  } else {
      filteredProducts.forEach(product => {
          let listItem = document.createElement("li");
          listItem.innerHTML = `
              <a href="product.html?name=${product.name}&price=${product.price}&image=${product.image}">
                  <img src="${product.image}" width="30" height="30"> ${product.name} - ₹${product.price}
              </a>
          `;
          listItem.style.padding = "5px";
          resultsContainer.appendChild(listItem);
      });
  }

  resultsContainer.style.display = "block"; // Show results

  // Check if Enter key is pressed (key code 13)
  if (event && event.key === "Enter") {
      let firstResult = resultsContainer.querySelector("a");
      if (firstResult) {
          window.location.href = firstResult.href; // Redirect to first search result
      }
  }
}

// Attach event listener to detect "Enter" keypress
document.getElementById("search-bar").addEventListener("keyup", searchProducts);
//Get cart items
function downloadEcards() {
  fetch('/get-cart')
    .then(response => response.json())
    .then(cartItems => {
      cartItems.forEach(item => {
        const a = document.createElement("a");
        a.href = `files/${item.card_name}.pdf`; 
        a.download = `${item.card_name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      Swal.fire({
        icon: "success",
        title: "Download Complete",
        text: "Your selected e-cards have been downloaded!"
      });

      // Redirect to homepage
      window.location.href = "index.html";
    })
    .catch(error => console.error("Error fetching cart items:", error));
}




