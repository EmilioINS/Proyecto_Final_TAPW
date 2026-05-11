export const DocumentApi = {
    async getHistory() {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/documents', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener historial de documentos');
        }

        return await response.json();
    }
};
