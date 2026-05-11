const supabase = require('../config/supabase');

class StorageService {
    constructor() {
        this.bucketName = 'pdf_documents';
    }

    async uploadPdf(fileName, pdfBuffer) {
        // Upload the PDF buffer to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from(this.bucketName)
            .upload(fileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            throw new Error(`Error uploading to storage: ${error.message}`);
        }

        // Get the public URL
        const { data: urlData } = supabase
            .storage
            .from(this.bucketName)
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    }
}

module.exports = new StorageService();
