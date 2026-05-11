const crypto = require('crypto');
const templateRepository = require('../../infrastructure/repositories/TemplateRepository');
const documentRepository = require('../../infrastructure/repositories/DocumentRepository');
const pdfService = require('../../infrastructure/services/PdfService');
const storageService = require('../../infrastructure/services/StorageService');

class DocumentUseCase {
    async processDocument(token, data, mode, userId) {
        // 1. Fetch Template by Token
        const template = await templateRepository.findByToken(token);
        if (!template) {
            throw new Error('Plantilla no encontrada o token inválido');
        }

        // 2. Generate a unique hash for the document based on template ID and the data payload
        const hashString = `${template.id}-${JSON.stringify(data)}`;
        const documentHash = crypto.createHash('sha256').update(hashString).digest('hex');

        // 3. Check if document already exists
        const existingDoc = await documentRepository.findByHash(documentHash);

        if (mode === 'consult') {
            if (existingDoc) {
                return {
                    message: 'Documento encontrado',
                    pdf_url: existingDoc.pdf_url,
                    generated: false
                };
            } else {
                throw new Error('Documento no encontrado para los datos proporcionados');
            }
        }

        // Mode is 'generate' (or fallback)
        if (existingDoc) {
            // Even if generating, if it already exists exactly, just return the existing one to save resources
            return {
                message: 'Documento ya había sido generado previamente',
                pdf_url: existingDoc.pdf_url,
                generated: false
            };
        }

        // 4. Generate the PDF buffer using Puppeteer
        const pdfBuffer = await pdfService.generatePdfFromHtml(template.html_content, data);

        // 5. Upload to Supabase Storage
        const fileName = `${template.id}/${documentHash}.pdf`;
        const pdfUrl = await storageService.uploadPdf(fileName, pdfBuffer);

        // 6. Save record in database
        await documentRepository.create({
            template_id: template.id,
            user_id: userId,
            document_hash: documentHash,
            pdf_url: pdfUrl,
            metadata: data
        });

        return {
            message: 'Documento generado exitosamente',
            pdf_url: pdfUrl,
            generated: true
        };
    }
}

module.exports = new DocumentUseCase();
