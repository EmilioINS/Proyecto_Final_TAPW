const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../infrastructure/repositories/UserRepository');

class AuthUseCase {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default_secret';
    }

    async registerUser(name, email, password) {
        // Check if user already exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('El usuario ya existe con este correo');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await userRepository.create({
            name,
            email,
            password_hash
        });

        return newUser;
    }

    async loginUser(email, password) {
        // Find user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Credenciales inválidas');
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };

        const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' });

        return {
            token,
            user: { id: user.id, name: user.name, email: user.email }
        };
    }
}

module.exports = new AuthUseCase();
