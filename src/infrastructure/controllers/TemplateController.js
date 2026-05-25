const templateUseCase = require('../../application/useCases/TemplateUseCase');

class TemplateController {
    async create(req, res) {
        try {
            // req.user is populated by authMiddleware
            const userId = req.user.id;
            const templateData = req.body;
            
            const newTemplate = await templateUseCase.createTemplate(templateData, userId);
            res.status(201).json({ 
                message: 'Plantilla creada exitosamente', 
                template: newTemplate 
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const templates = await templateUseCase.getAllTemplates();
            res.status(200).json(templates);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const template = await templateUseCase.getTemplateById(id);
            res.status(200).json(template);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new TemplateController();
