const { User } = require('../../models');
const bcrypt = require('bcrypt');

class AuthService {
    static async register(email, password, full_name, profession) {
        try {
            const defaultRole = 'user';

            if(!email || !password || !full_name || !profession) {
                throw new Error('Missing required fields');
            }

            if(await User.findOne({ where: { email } })) {
                throw new Error('User already exists');
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
            throw new Error(error.message);
        }
    }

    static async login(email, password) {
        try {
            if(!email || !password) {
                throw new Error('Missing required fields');
            }
            const user = await User.findOne({ where: { email } });
            
            if(!user) {
                throw new Error('User not found');
            }
            
            if(user.role !== 'admin' && user.role !== 'user') {
                throw new Error('Invalid role');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid) {
                throw new Error('Invalid password');
            }
            
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = AuthService;