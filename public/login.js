// API Configuration
const API_URL = 'https://edushare-h9d4ffeqh2fqacfz.francecentral-01.azurewebsites.net/api';

// Get form element
const loginForm = document.querySelector('.login-form');

// Check if user email is stored (from registration)
window.addEventListener('DOMContentLoaded', () => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
        document.getElementById('email').value = storedEmail;
    }
});

// Add submit event listener
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Basic client-side validation
    if (!email || !password) {
        showMessage('Email and password are required', 'error');
        return;
    }
    
    // Disable submit button
    const submitBtn = loginForm.querySelector('.btn-login');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        // Make API call
        console.log('Attempting login with API URL:', API_URL);
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.success) {
            // Success - store user data and redirect
            showMessage('Login successful! Redirecting...', 'success');
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');
            
            if (remember) {
                localStorage.setItem('userEmail', email);
            } else {
                localStorage.removeItem('userEmail');
            }
            
            // Redirect to files page after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'files.html';
            }, 1500);
        } else {
            // Show error message from server
            showMessage(data.message || 'Login failed. Please check your credentials.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } catch (error) {
        console.error('Login error:', error);
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
    formWrapper.insertBefore(messageBox, loginForm);
    
    // Auto-remove message after 5 seconds (unless it's success message)
    if (type !== 'success') {
        setTimeout(() => {
            messageBox.remove();
        }, 5000);
    }
}
