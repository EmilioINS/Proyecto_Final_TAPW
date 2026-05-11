const supabase = require('../config/supabase');
const Document = require('../../domain/models/Document');

class DocumentRepository {
    async create(documentData) {
        const { template_id, user_id, document_hash, pdf_url, metadata } = documentData;
        
        const { data, error } = await supabase
            .from('generated_documents')
            .insert([{ 
                template_id, 
                user_id, 
                document_hash, 
                pdf_url,
                metadata 
            }])
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        return new Document(data);
    }

    async findByHash(documentHash) {
        const { data, error } = await supabase
            .from('generated_documents')
            .select('*')
            .eq('document_hash', documentHash)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Database error: ${error.message}`);
        }

        if (!data) return null;
        return new Document(data);
    }

    async findAllByUserId(userId) {
        const { data, error } = await supabase
            .from('generated_documents')
            .select('*, templates(name)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        return data; // Returns raw data with joined template name
    }
}

module.exports = new DocumentRepository();
