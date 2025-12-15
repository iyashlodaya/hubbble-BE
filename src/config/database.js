require('dotenv').config();

const baseConfig = {
  dialect: 'postgres',
  logging: false,
};

// Function to generate config based on environment presence of DATABASE_URL
const getEnvConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      use_env_variable: 'DATABASE_URL',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        // Force IPv4 to avoid ENETUNREACH on Render/Node 17+
        family: 4,
      },
    };
  } else {
    return {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'hubbble_dev',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
    };
  }
};

const config = {
  ...baseConfig,
  ...getEnvConfig(),
};

module.exports = {
  development: { ...config },
  test: {
    ...config,
    database: process.env.DB_NAME_TEST || 'hubbble_test',
    // If testing typically doesn't use the remote URL, you might want to override here.
    // For now, we assume if DATABASE_URL is set, we use it even in test, 
    // OR you can explicitly unset use_env_variable for test if needed.
  },
  production: {
    ...config,
    logging: true,
    // Production always expects DATABASE_URL
    use_env_variable: 'DATABASE_URL',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      family: 4,
    },
  },
};
