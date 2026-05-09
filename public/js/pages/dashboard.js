import { AuthApi } from '../api/authApi.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Authentication
    const token = localStorage.getItem('token');
    if (!token) {
        // Not authenticated, redirect to login
        window.location.href = '/views/auth/login.html';
        return;
    }

    // Decode simple payload from JWT to get user info (assuming standard JWT structure: header.payload.signature)
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        
        if (decodedPayload && decodedPayload.user) {
            document.getElementById('user-name').textContent = decodedPayload.user.name;
            document.getElementById('user-avatar').textContent = decodedPayload.user.name.charAt(0).toUpperCase();
        }
    } catch (e) {
        console.error('Error decoding token', e);
        // Invalid token format
        localStorage.removeItem('token');
        window.location.href = '/views/auth/login.html';
    }

    // 2. Navigation Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            viewSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show target section
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Update title
            pageTitle.textContent = link.textContent.trim();
        });
    });

    // 3. Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                // Inform backend to optionally invalidate/log (even though it's stateless here)
                await AuthApi.logout();
            } catch (e) {
                console.warn("Error calling logout API", e);
            } finally {
                // Clear local storage and redirect
                localStorage.removeItem('token');
                window.location.href = '/views/auth/login.html';
            }
        });
    }
});
