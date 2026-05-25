const supabase = require('../config/supabase');
const Department = require('../../domain/models/Department');

class DepartmentRepository {
    async create(departmentData) {
        const { name, description } = departmentData;
        
        const { data, error } = await supabase
            .from('departments')
            .insert([{ name, description }])
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        return new Department(data);
    }

    async findAll() {
        const { data, error } = await supabase
            .from('departments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        return data.map(d => new Department(d));
    }

    async findById(id) {
        const { data, error } = await supabase
            .from('departments')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Database error: ${error.message}`);
        }

        if (!data) return null;
        return new Department(data);
    }

    async update(id, updateData) {
        // Prepare update object, potentially omitting undefined fields
        const payload = {};
        if (updateData.name !== undefined) payload.name = updateData.name;
        if (updateData.description !== undefined) payload.description = updateData.description;
        payload.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('departments')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        if (!data) return null;
        return new Department(data);
    }

    async delete(id) {
        const { error } = await supabase
            .from('departments')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }
        
        return true;
    }
}

module.exports = new DepartmentRepository();
