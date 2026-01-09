// API Configuration
const API_URL = 'https://edushare-h9d4ffeqh2fqacfz.francecentral-01.azurewebsites.net/api';

// Get form element
const registerForm = document.querySelector('.register-form');

// Add submit event listener
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Basic client-side validation
    if (!firstName || !lastName || !email || !password) {
        showMessage('All fields are required', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Disable submit button
    const submitBtn = registerForm.querySelector('.btn-register');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    
    try {
        // Make API call
        console.log('Attempting registration with API URL:', API_URL);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.success) {
            // Success - show message and redirect
            showMessage('Account created successfully! Redirecting to login...', 'success');
            
            // Store user info (optional)
            localStorage.setItem('userEmail', email);
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            // Show error message from server
            showMessage(data.message || 'Registration failed. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Unable to connect to server. Please make sure the backend is running.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Function to show messages
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.message-box');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;
    messageBox.textContent = message;
    
    // Insert message before form
    const formWrapper = document.querySelector('.form-wrapper');
    formWrapper.insertBefore(messageBox, registerForm);
    
    // Auto-remove message after 5 seconds (unless it's success message)
    if (type !== 'success') {
        setTimeout(() => {
            messageBox.remove();
        }, 5000);
    }
}
