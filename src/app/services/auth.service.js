const { User } = require('../../models');
const bcrypt = require('bcrypt');

class AuthService {
    static async register(email, password, full_name, profession, role) {
        try {
            if(!email || !password || !full_name || !profession || !role) {
                throw new Error('Missing required fields');
            }
            if(role !== 'admin' && role !== 'user') {
                throw new Error('Invalid role');
            }
            if(await User.findOne({ where: { email } })) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
        

            const user = await User.create({ email, password: hashedPassword, full_name, profession, role });
            return user;
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