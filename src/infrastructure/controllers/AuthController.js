const authUseCase = require('../../application/useCases/AuthUseCase');

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            await authUseCase.registerUser(name, email, password);
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
            }

            const data = await authUseCase.loginUser(email, password);
            res.status(200).json(data);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
