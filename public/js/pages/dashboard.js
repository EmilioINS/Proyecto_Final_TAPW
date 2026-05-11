import { AuthApi } from '../api/authApi.js';
import { TemplateApi } from '../api/templateApi.js';
import { DocumentApi } from '../api/documentApi.js';

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

            // Load data based on target
            if (targetId === 'templates') {
                loadTemplates();
            } else if (targetId === 'history') {
                loadHistory();
            } else if (targetId === 'overview') {
                updateOverviewStats();
            }
        });
    });

    // 3. Data Loading Functions
    async function loadTemplates() {
        const tbody = document.getElementById('templates-table-body');
        try {
            tbody.innerHTML = '<tr><td colspan="3" style="padding: 1rem; text-align: center; color: var(--text-muted);">Cargando...</td></tr>';
            const templates = await TemplateApi.getAll();
            
            if (templates.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="padding: 1rem; text-align: center; color: var(--text-muted);">No tienes plantillas creadas.</td></tr>';
                return;
            }

            tbody.innerHTML = templates.map(t => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 1rem;"><strong>${t.name}</strong></td>
                    <td style="padding: 1rem; color: var(--text-muted);">${t.description || '-'}</td>
                    <td style="padding: 1rem; font-family: monospace; color: #34d399;">${t.token}</td>
                </tr>
            `).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="3" style="padding: 1rem; text-align: center; color: #ef4444;">${error.message}</td></tr>`;
        }
    }

    async function loadHistory() {
        const tbody = document.getElementById('history-table-body');
        try {
            tbody.innerHTML = '<tr><td colspan="4" style="padding: 1rem; text-align: center; color: var(--text-muted);">Cargando...</td></tr>';
            const history = await DocumentApi.getHistory();
            
            if (history.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="padding: 1rem; text-align: center; color: var(--text-muted);">No has generado ningún documento aún.</td></tr>';
                return;
            }

            tbody.innerHTML = history.map(doc => {
                const date = new Date(doc.created_at).toLocaleDateString();
                const templateName = doc.templates ? doc.templates.name : 'Desconocida';
                return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 1rem;"><strong>${templateName}</strong></td>
                    <td style="padding: 1rem; font-family: monospace; font-size: 0.85rem; color: var(--text-muted);">${doc.document_hash.substring(0, 16)}...</td>
                    <td style="padding: 1rem; color: var(--text-muted);">${date}</td>
                    <td style="padding: 1rem;">
                        <a href="${doc.pdf_url}" target="_blank" style="color: var(--accent); text-decoration: none; font-weight: 600;">Ver PDF</a>
                    </td>
                </tr>
            `}).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="4" style="padding: 1rem; text-align: center; color: #ef4444;">${error.message}</td></tr>`;
        }
    }

    async function updateOverviewStats() {
        try {
            const templates = await TemplateApi.getAll();
            const history = await DocumentApi.getHistory();
            
            document.querySelector('.stat-card:nth-child(1) .value').textContent = templates.length;
            document.querySelector('.stat-card:nth-child(2) .value').textContent = history.length;
        } catch (error) {
            console.error('Error actualizando estadísticas', error);
        }
    }

    // 4. Logout Logic
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
