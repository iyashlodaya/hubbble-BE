const AuthService = require('../services/auth.service');

class AuthController {
    static async register(request, reply) {
        try {
            console.log("REGISTER REQUEST", request.body);
            const { email, password, full_name, profession } = request.body;
            const { message, data } = await AuthService.register(email, password, full_name, profession);
            return reply.code(201).send({ message, data });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to register user');
            const statusCode = error.statusCode || 500;
            const message = error.message || 'Unable to register user right now';
            return reply.code(statusCode).send({ message });
        }
    }

    static async login(request, reply) {
        try {
            console.log("LOGIN REQUEST", request.body);
            const { email, password } = request.body;
            const { message, data } = await AuthService.login(email, password);
            return reply.code(200).send({ message, data });
        }
        catch (error) {
            request.log.error({ err: error }, 'Failed to login user');
            const statusCode = error.statusCode || 500;
            const message = error.message || 'Unable to login user right now';
            return reply.code(statusCode).send({ message });
        }
    }

    static async me(request, reply) {
        try {
            return reply.code(200).send({
                message: 'User retrieved successfully',
                data: request.user
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to retrieve user');
            return reply.code(500).send({ message: 'Unable to retrieve user' });
        }
    }
}

module.exports = AuthController;