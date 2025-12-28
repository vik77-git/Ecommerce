function loginUser() {
    // Example login logic - replace with actual authentication logic
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Simulating login verification (Replace with actual server authentication)
    if (email === "test@example.com" && password === "password123") {
        localStorage.setItem("isLoggedIn", "true"); // Store login status
        window.location.href = "index.html"; // Redirect to home after login
    } else {
        alert("Invalid credentials! Please try again.");
    }
}
