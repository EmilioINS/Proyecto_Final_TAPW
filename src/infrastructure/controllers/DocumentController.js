const documentUseCase = require('../../application/useCases/DocumentUseCase');

class DocumentController {
    async generateOrConsult(req, res) {
        try {
            // req.user from authMiddleware
            const userId = req.user.id;
            const { token, data, mode } = req.body;

            if (!token || !data) {
                return res.status(400).json({ message: 'El token de la plantilla y los datos son requeridos' });
            }

            // mode can be 'generate' or 'consult'
            const validMode = mode === 'consult' ? 'consult' : 'generate';

            const result = await documentUseCase.processDocument(token, data, validMode, userId);
            
            res.status(200).json(result);
        } catch (error) {
            // Determine if it's a 404 (not found) or 400/500
            const statusCode = error.message.includes('no encontrado') ? 404 : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async getHistory(req, res) {
        try {
            const userId = req.user.id;
            const history = await documentUseCase.getUserDocuments(userId);
            res.status(200).json(history);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new DocumentController();
