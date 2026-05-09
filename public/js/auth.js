document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const alertBox = document.getElementById('alert-box');

    const showAlert = (message, type = 'error') => {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
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
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al iniciar sesión');
                }

                // Guardar token en localStorage (o cookie)
                localStorage.setItem('token', data.token);
                showAlert('Inicio de sesión exitoso', 'success');
                
                // Redirigir al dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard.html'; // Próximo a crear
                }, 1000);

            } catch (error) {
                showAlert(error.message);
            } finally {
                setLoading(btn, false);
            }
        });
    }

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
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al registrar usuario');
                }

                showAlert('Registro exitoso. Redirigiendo al login...', 'success');
                
                // Redirigir al login
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 2000);

            } catch (error) {
                showAlert(error.message);
            } finally {
                setLoading(btn, false);
            }
        });
    }
});
