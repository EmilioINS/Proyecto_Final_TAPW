const supabase = require('../config/supabase');
const User = require('../../domain/models/User');

class UserRepository {
    async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
            throw new Error(`Database error: ${error.message}`);
        }

        if (!data) return null;
        return new User(data);
    }

    async create(userData) {
        const { name, email, password_hash } = userData;
        
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, password_hash }])
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        return new User(data);
    }
}

module.exports = new UserRepository();
