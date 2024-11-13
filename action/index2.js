document.addEventListener('DOMContentLoaded', async () => {
    // Load profile data
    try {
        const response = await fetch('/api/profile');
        if (response.ok) {
            const profileData = await response.json();
            Object.keys(profileData).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = profileData[key];
                }
            });
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }

    // Handle form submission
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileData = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });
            
            if (response.ok) {
                const successMessage = document.getElementById('successMessage');
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    });

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        // Clear any stored session data
        localStorage.clear();
        sessionStorage.clear();
        // Redirect to login page
        window.location.href = '/Login.html';
    });
});