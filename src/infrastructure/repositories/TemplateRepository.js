const supabase = require('../config/supabase');
const Template = require('../../domain/models/Template');

class TemplateRepository {
    async create(templateData) {
        const { name, description, html_content, department_id, created_by } = templateData;
        
        const { data, error } = await supabase
            .from('templates')
            .insert([{ 
                name, 
                description, 
                html_content, 
                department_id,
                created_by 
            }])
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        return new Template(data);
    }

    async findAll() {
        const { data, error } = await supabase
            .from('templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        return data.map(t => new Template(t));
    }

    async findById(id) {
        const { data, error } = await supabase
            .from('templates')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Database error: ${error.message}`);
        }

        if (!data) return null;
        return new Template(data);
    }
}

module.exports = new TemplateRepository();
