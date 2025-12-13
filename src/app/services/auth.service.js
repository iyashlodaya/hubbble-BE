const { User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

class AuthService {
    static async register(email, password, full_name, profession) {
        try {
            const defaultRole = 'user';

            if(!email || !password || !full_name || !profession) {
                throw new AppError('Missing required fields', 400);
            }

            if(await User.findOne({ where: { email } })) {
                throw new AppError('User already exists', 409);
            }

            const hashedPassword = await bcrypt.hash(password, 10);
        
            const user = await User.create({ email, password: hashedPassword, full_name, profession, role: defaultRole });

            const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const expiresIn = 3600;

            return {
                message: 'User registered successfully',
                data: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    profession: user.profession,
                    role: user.role,
                    accessToken,
                    refreshToken,
                    expiresIn,
                },
            };
        } catch (error) {
            // If it's already an AppError, re-throw it
            if (error instanceof AppError) {
                throw error;
            }
            // Otherwise wrap it in a generic server error
            throw new AppError(error.message || 'Unable to register user', 500);
        }
    }

    static async login(email, password) {
        try {
            if(!email || !password) {
                throw new AppError('Missing required fields', 400);
            }
            const user = await User.findOne({ where: { email } });
            
            if(!user) {
                throw new AppError('User not found', 404);
            }
            
            if(user.role !== 'admin' && user.role !== 'user') {
                throw new AppError('Invalid role', 403);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid) {
                throw new AppError('Invalid password', 401);
            }
            
            return user;
        } catch (error) {
            // If it's already an AppError, re-throw it
            if (error instanceof AppError) {
                throw error;
            }
            // Otherwise wrap it in a generic server error
            throw new AppError(error.message || 'Unable to login user', 500);
        }
    }
}

module.exports = AuthService;