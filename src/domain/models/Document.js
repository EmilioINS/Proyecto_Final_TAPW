class Document {
    constructor({ id, template_id, user_id, document_hash, pdf_url, metadata, created_at }) {
        this.id = id;
        this.template_id = template_id;
        this.user_id = user_id;
        this.document_hash = document_hash;
        this.pdf_url = pdf_url;
        this.metadata = metadata;
        this.created_at = created_at;
    }
}

module.exports = Document;
