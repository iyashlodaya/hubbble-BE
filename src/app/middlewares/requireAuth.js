const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const AppError = require('../utils/AppError');

/**
 * Fastify preHandler to ensure requests carry a valid access token.
 * Attaches the authenticated user instance to request.user when successful.
 */
async function requireAuth(request, reply) {
    const authHeader = request.headers.authorization;

    try {
        if (!process.env.JWT_SECRET) {
            throw new AppError('JWT secret is not configured', 500);
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Authorization token missing', 401);
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new AppError('Authorization token missing', 401);
        }

        let payload;

        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new AppError('Access token expired', 401);
            }

            throw new AppError('Invalid access token', 401);
        }

        const user = await User.findByPk(payload.userId, {
            attributes: ['id', 'email', 'full_name', 'profession', 'role'],
        });

        if (!user) {
            throw new AppError('User not found', 401);
        }

        request.user = user;
    } catch (error) {
        const statusCode = error.statusCode || 401;
        // Explicitly ensuring CORS headers are present even on errors
        reply.header('Access-Control-Allow-Origin', '*'); 
        reply.header('Access-Control-Allow-Credentials', 'true');
        return reply.code(statusCode).send({ message: error.message || 'Unauthorized' });
    }
}

module.exports = requireAuth;
