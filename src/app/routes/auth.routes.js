const AuthController = require('../controllers/auth.controller');

const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'full_name', 'profession'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      full_name: { type: 'string' },
      profession: { type: 'string' },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            full_name: { type: 'string' },
            profession: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user'] },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'integer' },
          },
        },
      },
    },
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};

const loginSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user'] },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'integer' },
          },
          additionalProperties: false,
        },
      },
    },
  },
};

async function authRoutes(fastify) {
  fastify.post('/auth/register', { schema: registerSchema }, AuthController.register);
  fastify.post('/auth/login', { schema: loginSchema }, AuthController.login);
//   fastify.post('/auth/logout', { schema: logoutSchema }, AuthController.logout);
//   fastify.post('/auth/refresh', { schema: refreshSchema }, AuthController.refresh);
//   fastify.post('/auth/forgot-password', { schema: forgotPasswordSchema }, AuthController.forgotPassword);
//   fastify.post('/auth/reset-password', { schema: resetPasswordSchema }, AuthController.resetPassword);
//   fastify.post('/auth/verify-email', { schema: verifyEmailSchema }, AuthController.verifyEmail);
//   fastify.post('/auth/resend-verification-email', { schema: resendVerificationEmailSchema }, AuthController.resendVerificationEmail);
//   fastify.post('/auth/send-verification-email', { schema: sendVerificationEmailSchema }, AuthController.sendVerificationEmail);
//   fastify.post('/auth/send-reset-password-email', { schema: sendResetPasswordEmailSchema }, AuthController.sendResetPasswordEmail);
//   fastify.post('/auth/send-verification-email', { schema: sendVerificationEmailSchema }, AuthController.sendVerificationEmail);
}


module.exports = authRoutes;
