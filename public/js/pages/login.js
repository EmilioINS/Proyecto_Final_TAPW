import { AuthApi } from '../api/authApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const alertBox = document.getElementById('alert-box');

    const showAlert = (message, type = 'error') => {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = 'block';
        setTimeout(() => alertBox.style.display = 'none', 5000);
    };

    const setLoading = (button, isLoading) => {
        if (isLoading) {
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span>Cargando...</span>';
            button.disabled = true;
        } else {
            button.innerHTML = button.dataset.originalText;
            button.disabled = false;
        }
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = document.getElementById('login-btn');

            setLoading(btn, true);

            try {
                const data = await AuthApi.login(email, password);
                localStorage.setItem('token', data.token);
                showAlert('Inicio de sesión exitoso', 'success');
                
                setTimeout(() => {
                    window.location.href = '/views/dashboard/index.html'; // Próximo a crear
                }, 1000);

            } catch (error) {
                showAlert(error.message);
            } finally {
                setLoading(btn, false);
            }
        });
    }
});
