export const TemplateApi = {
    async getAll() {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/templates', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener plantillas');
        }

        return await response.json();
    }
};
