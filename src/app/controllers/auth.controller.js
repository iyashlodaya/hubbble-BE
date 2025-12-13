const AuthService = require('../services/auth.service');

class AuthController {
    static async register(request, reply) {
        try {
            const { email, password, name, role } = request.body;
            const user = await AuthService.register(email, password, name, role);
            return reply.code(201).send({ message: 'User registered successfully', data: user });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to register user');
            return reply.code(500).send({ message: 'Unable to register user right now' });
        }
    }

    static async login(request, reply) {
        try {
            const { email, password } = request.body;
            const user = await AuthService.login(email, password);
            return reply.code(200).send({ message: 'User logged in successfully', data: user });
        }
        catch (error) {
            request.log.error({ err: error }, 'Failed to login user');
            return reply.code(500).send({ message: 'Unable to login user right now' });
        }
    }
}

module.exports = AuthController;