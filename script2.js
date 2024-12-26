document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const age = document.getElementById("age").value.trim();
    const country = document.getElementById("country").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validate required fields
    if (!firstName || !lastName || !email || !mobile || !age || !country || !message) {
        displayMessage("Please fill in all required fields.", "error");
        return;
    }

    if (isNaN(age) || age <= 0) {
        displayMessage("Please enter a valid age.", "error");
        return;
    }

    if (!/^\d+$/.test(mobile)) {
        displayMessage("Please enter a valid mobile number.", "error");
        return;
    }

    // Display success message
    displayMessage(`Thank you, ${firstName} ${lastName}! Your message has been sent successfully.`, "success");

    // Reset the form
    document.getElementById("contact-form").reset();
});

// Function to display messages
function displayMessage(message, type) {
    const messageContainer = document.getElementById("form-message");
    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`; // Add appropriate class based on message type
    messageContainer.style.display = "block";

    // Hide the message after 5 seconds
    setTimeout(() => {
        messageContainer.style.display = "none";
    }, 5000);
}
