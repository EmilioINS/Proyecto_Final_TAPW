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
    // 4. Data Fetching and Rendering
    const loadTemplates = async () => {
        try {
            const response = await fetch('/api/templates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar plantillas');
            const templates = await response.json();
            
            const container = document.getElementById('templates-container');
            const select = document.getElementById('template-select');
            
            container.innerHTML = '';
            // keep the first disabled option in select
            select.innerHTML = '<option value="" disabled selected>Selecciona una plantilla</option>';
            
            // update metrics
            const templateMetric = document.querySelectorAll('.stat-card .value')[0];
            if(templateMetric) templateMetric.textContent = templates.length;

            templates.forEach(t => {
                // Add to view grid
                const card = document.createElement('div');
                card.className = 'stat-card';
                card.innerHTML = `
                    <h3>${t.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem;">${t.description || 'Sin descripción'}</p>
                    <p style="color: var(--text-muted); font-size: 0.75rem; margin-top: 1rem;">Token: <code style="color: var(--accent);">${t.token}</code></p>
                `;
                container.appendChild(card);

                // Add to select options
                const option = document.createElement('option');
                option.value = t.token;
                option.textContent = t.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const loadHistory = async () => {
        try {
            const response = await fetch('/api/documents', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar historial');
            const history = await response.json();
            
            const tbody = document.getElementById('history-container');
            tbody.innerHTML = '';
            
            // update metrics
            const documentMetric = document.querySelectorAll('.stat-card .value')[1];
            if(documentMetric) documentMetric.textContent = history.length;

            history.forEach(doc => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--surface-border)';
                const date = new Date(doc.created_at).toLocaleDateString();
                
                tr.innerHTML = `
                    <td style="padding: 1rem;">${doc.templates?.name || 'Desconocido'}</td>
                    <td style="padding: 1rem; color: var(--text-muted);">${date}</td>
                    <td style="padding: 1rem;">
                        <a href="${doc.pdf_url}" target="_blank" style="color: #34d399; text-decoration: none; font-weight: 500;">Ver PDF</a>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const setupGenerator = () => {
        const form = document.getElementById('generator-form');
        const resultDiv = document.getElementById('generator-result');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = '<p style="color: var(--text-muted);">Generando...</p>';
                
                const tokenInput = document.getElementById('template-select').value;
                const jsonInput = document.getElementById('json-data').value;
                
                let data;
                try {
                    data = JSON.parse(jsonInput);
                } catch (err) {
                    resultDiv.innerHTML = '<p style="color: var(--error);">Error: JSON inválido.</p>';
                    return;
                }
                
                try {
                    const response = await fetch('/api/documents', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ token: tokenInput, data, mode: 'generate' })
                    });
                    
                    const result = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(result.message || 'Error al generar documento');
                    }
                    
                    resultDiv.innerHTML = `
                        <p style="color: #34d399; margin-bottom: 0.5rem;">${result.message}</p>
                        <a href="${result.pdf_url}" target="_blank" class="btn-primary" style="display: inline-block; text-decoration: none;">Abrir Documento</a>
                    `;
                    
                    // Reload history to show the new document
                    loadHistory();
                } catch (error) {
                    resultDiv.innerHTML = `<p style="color: var(--error);">Error: ${error.message}</p>`;
                }
            });
        }
    };

    // Initialize
    loadTemplates();
    loadHistory();
    setupGenerator();
});
