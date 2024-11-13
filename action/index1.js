document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/Profile.html';
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'An error occurred. Please try again.';
    }
});