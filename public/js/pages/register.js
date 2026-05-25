import { AuthApi } from '../api/authApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const alertBox = document.getElementById('alert-box');

    const showAlert = (message, type = 'error') => {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = 'block';
        setTimeout(() => alertBox.style.display = 'none', 5000);
    };

    const setLoading = (button, isLoading) => {
        const span = button.querySelector('span');
        if (isLoading) {
            button.dataset.originalText = span.textContent;
            span.textContent = 'Cargando...';
            button.disabled = true;
        } else {
            span.textContent = button.dataset.originalText;
            button.disabled = false;
        }
    };

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const btn = document.getElementById('register-btn');

            if (password !== confirmPassword) {
                showAlert('Las contraseñas no coinciden');
                return;
            }

            setLoading(btn, true);

            try {
                await AuthApi.register(name, email, password);
                showAlert('Registro exitoso. Redirigiendo al login...', 'success');
                
                setTimeout(() => {
                    window.location.href = '/views/auth/login.html';
                }, 2000);

            } catch (error) {
                showAlert(error.message);
            } finally {
                setLoading(btn, false);
            }
        });
    }
});
