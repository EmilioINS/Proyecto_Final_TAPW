import { AuthApi } from '../api/authApi.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Authentication & Setup User
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/views/auth/login.html';
        return;
    }

    let templatesCache = []; // Store fetched templates to support instant rendering
    let departmentsCache = []; // Store fetched departments

    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        
        if (decodedPayload && decodedPayload.user) {
            document.getElementById('user-name').textContent = decodedPayload.user.name;
            document.getElementById('user-avatar').textContent = decodedPayload.user.name.charAt(0).toUpperCase();
        }
    } catch (e) {
        console.error('Error decoding token', e);
        localStorage.removeItem('token');
        window.location.href = '/views/auth/login.html';
        return;
    }

    // 2. Navigation Control
    const navLinks = document.querySelectorAll('.nav-link');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            viewSections.forEach(s => s.classList.remove('active'));

            link.classList.add('active');

            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            pageTitle.textContent = link.querySelector('span').textContent.trim();
        });
    });

    // 3. Logout Control
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await AuthApi.logout();
            } catch (e) {
                console.warn("Logout endpoint error", e);
            } finally {
                localStorage.removeItem('token');
                window.location.href = '/views/auth/login.html';
            }
        });
    }

    // 4. Modals Control (Templates & Departments)
    const setupModals = () => {
        // Elements
        const templateModal = document.getElementById('template-modal');
        const deptModal = document.getElementById('department-modal');
        
        const openTemplateBtn = document.getElementById('btn-new-template');
        const openDeptBtn = document.getElementById('btn-new-dept');
        
        const closeTemplateBtn = document.getElementById('btn-close-template-modal');
        const closeDeptBtn = document.getElementById('btn-close-dept-modal');
        
        const templateOverlay = templateModal.querySelector('.modal-overlay');
        const deptOverlay = deptModal.querySelector('.modal-overlay');

        // Handlers
        const toggleModal = (modal, show) => {
            if (show) {
                modal.classList.add('active');
            } else {
                modal.classList.remove('active');
            }
        };

        if (openTemplateBtn) openTemplateBtn.addEventListener('click', () => toggleModal(templateModal, true));
        if (openDeptBtn) openDeptBtn.addEventListener('click', () => toggleModal(deptModal, true));

        if (closeTemplateBtn) closeTemplateBtn.addEventListener('click', () => toggleModal(templateModal, false));
        if (closeDeptBtn) closeDeptBtn.addEventListener('click', () => toggleModal(deptModal, false));

        if (templateOverlay) templateOverlay.addEventListener('click', () => toggleModal(templateModal, false));
        if (deptOverlay) deptOverlay.addEventListener('click', () => toggleModal(deptModal, false));
    };

    // 5. Helper Methods & Dynamic Form Engine
    const defaultSampleData = {
        "alumno": "Emilio Francisco Vázquez Pérez",
        "control": "20120987",
        "carrera": "Ingeniería en Sistemas Computacionales",
        "periodo": "Ene - Jun 2026",
        "materia1_nombre": "Taller de Administración de Portales Web",
        "materia1_calificacion": "98",
        "materia2_nombre": "Arquitectura de Software",
        "materia2_calificacion": "95",
        "materia3_nombre": "Programación Web Avanzada",
        "materia3_calificacion": "100",
        "materia4_nombre": "Administración de Bases de Datos",
        "materia4_calificacion": "90",
        "creditos": "32",
        "promedio": "95.75",
        "fecha": "24 de Mayo de 2026"
    };

    const getValueByPath = (obj, path) => {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (current === null || current === undefined) return undefined;
            current = current[key];
        }
        return current;
    };

    const setValueByPath = (obj, path, value) => {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    };

    const formatLabel = (path) => {
        const custom = {
            'alumno': 'Nombre del Alumno',
            'control': 'Número de Control',
            'carrera': 'Carrera',
            'periodo': 'Periodo Escolar',
            'creditos': 'Créditos Cursados',
            'promedio': 'Promedio General',
            'fecha': 'Fecha de Emisión'
        };
        if (custom[path.toLowerCase()]) return custom[path.toLowerCase()];
        
        return path
            .replace(/_/g, ' ')
            .replace(/\./g, ' - ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const extractVariables = (html) => {
        const regex = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;
        const variables = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            const varName = match[1].trim();
            if (!variables.includes(varName)) {
                variables.push(varName);
            }
        }
        return variables;
    };

    const generateDynamicForm = (template) => {
        const fieldsContainer = document.getElementById('dynamic-form-fields');
        if (!fieldsContainer) return;

        const variables = extractVariables(template.html_content);
        
        if (variables.length === 0) {
            fieldsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 2rem 0;">Esta plantilla no requiere ningún parámetro dinámico.</p>';
            return;
        }

        let currentData = {};
        const jsonText = document.getElementById('json-data').value;
        try {
            currentData = JSON.parse(jsonText);
        } catch (e) {
            currentData = {};
        }

        let dataUpdated = false;
        variables.forEach(v => {
            if (getValueByPath(currentData, v) === undefined) {
                const defaultValue = defaultSampleData[v] || '';
                setValueByPath(currentData, v, defaultValue);
                dataUpdated = true;
            }
        });

        if (dataUpdated || Object.keys(currentData).length === 0) {
            document.getElementById('json-data').value = JSON.stringify(currentData, null, 2);
        }

        fieldsContainer.innerHTML = '';
        variables.forEach(v => {
            const val = getValueByPath(currentData, v) || '';
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'form-group';
            fieldGroup.style.marginBottom = '1.2rem';

            const label = document.createElement('label');
            label.textContent = formatLabel(v);
            label.style.display = 'block';
            label.style.marginBottom = '0.5rem';
            label.style.fontSize = '0.85rem';
            label.style.color = '#FFF';

            let input;
            if (v.toLowerCase().includes('desc') || v.toLowerCase().includes('mensaje') || v.toLowerCase().includes('nota')) {
                input = document.createElement('textarea');
                input.rows = 3;
            } else {
                input = document.createElement('input');
                input.type = 'text';
            }

            input.className = 'form-control';
            input.placeholder = `Ingresa ${formatLabel(v).toLowerCase()}...`;
            input.value = val;
            input.setAttribute('data-var-path', v);

            input.addEventListener('input', () => {
                let freshData = {};
                try {
                    freshData = JSON.parse(document.getElementById('json-data').value);
                } catch (e) {
                    freshData = {};
                }
                setValueByPath(freshData, v, input.value);
                document.getElementById('json-data').value = JSON.stringify(freshData, null, 2);
                updateLivePreview();
            });

            fieldGroup.appendChild(label);
            fieldGroup.appendChild(input);
            fieldsContainer.appendChild(fieldGroup);
        });
    };

    const syncJsonToForm = () => {
        const jsonText = document.getElementById('json-data').value;
        let parsedData = {};
        try {
            parsedData = JSON.parse(jsonText);
        } catch (e) {
            return;
        }

        const inputs = document.querySelectorAll('#dynamic-form-fields [data-var-path]');
        inputs.forEach(input => {
            const path = input.getAttribute('data-var-path');
            const val = getValueByPath(parsedData, path);
            input.value = val !== undefined ? val : '';
        });
    };

    const setupModeToggle = () => {
        const btnForm = document.getElementById('btn-mode-form');
        const btnJson = document.getElementById('btn-mode-json');
        const formContainer = document.getElementById('dynamic-form-container');
        const jsonContainer = document.getElementById('json-editor-container');

        if (btnForm && btnJson && formContainer && jsonContainer) {
            btnForm.addEventListener('click', () => {
                btnForm.classList.add('active');
                btnForm.style.borderColor = 'var(--primary)';
                btnJson.classList.remove('active');
                btnJson.style.borderColor = '';
                
                formContainer.style.display = 'block';
                jsonContainer.style.display = 'none';

                syncJsonToForm();
            });

            btnJson.addEventListener('click', () => {
                btnJson.classList.add('active');
                btnJson.style.borderColor = 'var(--primary)';
                btnForm.classList.remove('active');
                btnForm.style.borderColor = '';

                jsonContainer.style.display = 'flex';
                formContainer.style.display = 'none';
            });
        }
    };

    // 6. microHandlebars compiler for Live Previews
    const compileTemplate = (html, data) => {
        return html.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (match, key) => {
            const keys = key.split('.');
            let value = data;
            for (const k of keys) {
                if (value && value[k] !== undefined) {
                    value = value[k];
                } else {
                    value = '';
                    break;
                }
            }
            return value !== null && value !== undefined ? value : '';
        });
    };

    const updateLivePreview = () => {
        const previewIframe = document.getElementById('preview-iframe');
        const previewPlaceholder = document.getElementById('preview-placeholder');
        const previewStatus = document.getElementById('preview-status');
        const selectedToken = document.getElementById('template-select').value;
        const jsonText = document.getElementById('json-data').value;

        if (!selectedToken) {
            previewPlaceholder.style.display = 'flex';
            previewIframe.style.display = 'none';
            previewStatus.textContent = 'Sin plantilla';
            previewStatus.className = 'badge out-of-sync';
            return;
        }

        const template = templatesCache.find(t => t.token === selectedToken);
        if (!template) return;

        let parsedData = {};
        try {
            parsedData = JSON.parse(jsonText);
            previewStatus.textContent = 'Sincronizado';
            previewStatus.className = 'badge';
        } catch (e) {
            previewStatus.textContent = 'JSON Inválido';
            previewStatus.className = 'badge out-of-sync';
            return;
        }

        previewPlaceholder.style.display = 'none';
        previewIframe.style.display = 'block';

        const compiledHtml = compileTemplate(template.html_content, parsedData);

        const doc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        doc.open();
        doc.write(compiledHtml);
        doc.close();
    };

    // 7. JSON Beautifier
    const setupJsonBeautifier = () => {
        const btnFormat = document.getElementById('btn-format-json');
        const textarea = document.getElementById('json-data');

        if (btnFormat && textarea) {
            btnFormat.addEventListener('click', () => {
                try {
                    const parsed = JSON.parse(textarea.value);
                    textarea.value = JSON.stringify(parsed, null, 2);
                    updateLivePreview();
                } catch (e) {
                    alert('Por favor introduce un JSON válido antes de formatear.');
                }
            });
        }
    };

    // 7. Loaders and CRUD implementations
    const loadDepartments = async () => {
        try {
            const response = await fetch('/api/departments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar departamentos');
            const departments = await response.json();
            departmentsCache = departments;

            // Update Metric
            const deptMetric = document.getElementById('count-departments');
            if (deptMetric) deptMetric.textContent = departments.length;

            // Update View Cards
            const container = document.getElementById('departments-container');
            if (container) {
                container.innerHTML = '';
                if (departments.length === 0) {
                    container.innerHTML = '<p class="section-subtitle">No hay departamentos creados.</p>';
                } else {
                    departments.forEach(d => {
                        const card = document.createElement('div');
                        card.className = 'dept-card';
                        card.innerHTML = `
                            <h3>${d.name}</h3>
                            <p>${d.description || 'Sin descripción'}</p>
                        `;
                        container.appendChild(card);
                    });
                }
            }

            // Populate select dropdown in Template Modal
            const select = document.getElementById('template-dept');
            if (select) {
                select.innerHTML = '<option value="" disabled selected>Selecciona un departamento...</option>';
                departments.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d.id;
                    opt.textContent = d.name;
                    select.appendChild(opt);
                });
            }
        } catch (e) {
            console.error('Error fetching departments:', e);
        }
    };

    const loadTemplates = async () => {
        try {
            const response = await fetch('/api/templates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar plantillas');
            const templates = await response.json();
            templatesCache = templates;

            // Update Metric
            const countLabel = document.getElementById('count-templates');
            if (countLabel) countLabel.textContent = templates.length;

            // Populate View Grid
            const container = document.getElementById('templates-container');
            if (container) {
                container.innerHTML = '';
                if (templates.length === 0) {
                    container.innerHTML = '<p class="section-subtitle">No hay plantillas registradas.</p>';
                } else {
                    templates.forEach(t => {
                        const card = document.createElement('div');
                        card.className = 'stat-card';
                        card.innerHTML = `
                            <div class="card-icon cyan-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            </div>
                            <div class="card-info" style="flex:1;">
                                <h3 style="color:#FFF; font-size:1.1rem; margin-bottom:0.3rem;">${t.name}</h3>
                                <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:0.7rem;">${t.description || 'Sin descripción'}</p>
                                <p style="color:var(--text-muted); font-size:0.75rem; font-family:monospace;">Token: <code style="color:var(--primary); font-weight:700;">${t.token}</code></p>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                }
            }

            // Populate select dropdown in Generator Form
            const genSelect = document.getElementById('template-select');
            if (genSelect) {
                genSelect.innerHTML = '<option value="" disabled selected>Selecciona una plantilla...</option>';
                templates.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.token;
                    opt.textContent = t.name;
                    genSelect.appendChild(opt);
                });
            }
        } catch (e) {
            console.error('Error fetching templates:', e);
        }
    };

    const loadHistory = async () => {
        try {
            const response = await fetch('/api/documents', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar historial');
            const history = await response.json();

            // Update Metric
            const countLabel = document.getElementById('count-documents');
            if (countLabel) countLabel.textContent = history.length;

            // Populate Table
            const tbody = document.getElementById('history-container');
            if (tbody) {
                tbody.innerHTML = '';
                if (history.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:2rem;">No se han generado documentos aún.</td></tr>';
                } else {
                    history.forEach(doc => {
                        const tr = document.createElement('tr');
                        const date = new Date(doc.created_at).toLocaleString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        tr.innerHTML = `
                            <td style="font-weight:700; color:#FFF;">${doc.templates?.name || 'Desconocido'}</td>
                            <td style="color:var(--text-muted);">${date}</td>
                            <td><code style="font-size:0.8rem; color:var(--accent);">${doc.document_hash.substring(0, 16)}...</code></td>
                            <td>
                                <a href="${doc.pdf_url}" target="_blank" class="btn-primary" style="display:inline-flex; padding:0.4rem 0.8rem; font-size:0.8rem; border-radius:8px;">
                                    <span>Ver PDF</span>
                                </a>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            }
        } catch (e) {
            console.error('Error fetching history:', e);
        }
    };

    // Forms Handlers
    const setupFormSubmissions = () => {
        // Department Form Submission
        const deptForm = document.getElementById('department-form');
        const deptModal = document.getElementById('department-modal');
        if (deptForm) {
            deptForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('dept-name').value;
                const description = document.getElementById('dept-desc').value;

                try {
                    const res = await fetch('/api/departments', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ name, description })
                    });
                    
                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.message || 'Error al registrar departamento');
                    }

                    // Reset and Close
                    deptForm.reset();
                    deptModal.classList.remove('active');
                    
                    // Reload
                    loadDepartments();
                } catch (err) {
                    alert('Error: ' + err.message);
                }
            });
        }

        // Template Form Submission
        const tempForm = document.getElementById('template-form');
        const tempModal = document.getElementById('template-modal');
        if (tempForm) {
            tempForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('template-name').value;
                const description = document.getElementById('template-desc').value;
                const department_id = document.getElementById('template-dept').value;
                const html_content = document.getElementById('template-html').value;

                try {
                    const res = await fetch('/api/templates', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ name, description, department_id, html_content })
                    });
                    
                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.message || 'Error al guardar plantilla');
                    }

                    // Reset and Close
                    tempForm.reset();
                    tempModal.classList.remove('active');
                    
                    // Reload
                    loadTemplates();
                } catch (err) {
                    alert('Error: ' + err.message);
                }
            });
        }

        // Document Generator Submission
        const genForm = document.getElementById('generator-form');
        const resultDiv = document.getElementById('generator-result');
        if (genForm) {
            genForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const selectedToken = document.getElementById('template-select').value;
                const jsonText = document.getElementById('json-data').value;
                const btnSubmit = document.getElementById('btn-submit-generator');

                let data;
                try {
                    data = JSON.parse(jsonText);
                } catch (err) {
                    alert('El JSON de entrada no es válido');
                    return;
                }

                // UI Loading state
                btnSubmit.disabled = true;
                const btnSpan = btnSubmit.querySelector('span');
                const origText = btnSpan.textContent;
                btnSpan.textContent = 'Renderizando en Supabase...';
                
                resultDiv.style.display = 'none';

                try {
                    const response = await fetch('/api/documents', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ token: selectedToken, data, mode: 'generate' })
                    });
                    
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.message || 'Error al generar documento');
                    }

                    resultDiv.style.display = 'flex';
                    resultDiv.innerHTML = `
                        <p style="color:var(--emerald); font-weight:700; font-size:0.9rem;">✨ ¡PDF generado con éxito!</p>
                        <a href="${result.pdf_url}" target="_blank" class="btn-primary" style="padding:0.4rem 0.8rem; font-size:0.8rem; border-radius:8px;">
                            <span>Abrir Documento</span>
                        </a>
                    `;

                    loadHistory();
                } catch (error) {
                    alert('Error al generar PDF: ' + error.message);
                } finally {
                    btnSubmit.disabled = false;
                    btnSpan.textContent = origText;
                }
            });
        }
    };

    // 8. Event listeners for Live Preview & Dynamic Form Generation
    const setupLivePreviewTriggers = () => {
        const select = document.getElementById('template-select');
        const textarea = document.getElementById('json-data');

        if (select) {
            select.addEventListener('change', () => {
                const selectedToken = select.value;
                const template = templatesCache.find(t => t.token === selectedToken);
                if (template) {
                    generateDynamicForm(template);
                }
                updateLivePreview();
            });
        }
        if (textarea) {
            textarea.addEventListener('input', () => {
                updateLivePreview();
                const formContainer = document.getElementById('dynamic-form-container');
                if (formContainer && formContainer.style.display !== 'none') {
                    syncJsonToForm();
                }
            });
        }
    };

    // Initialize Dashboard
    setupModals();
    setupJsonBeautifier();
    setupFormSubmissions();
    setupModeToggle();
    setupLivePreviewTriggers();

    // Fetch Init Data
    loadDepartments();
    loadTemplates();
    loadHistory();
});
