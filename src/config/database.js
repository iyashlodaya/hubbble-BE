require("dotenv").config();

const common = {
  dialect: "postgres",
  logging: false,
};

if (!process.env.DATABASE_URL) {
  Object.assign(common, {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "hubbble_dev",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
  });
}

module.exports = {
  development: {
    ...common,
  },
  test: {
    ...common,
    database: process.env.DB_NAME_TEST || "hubbble_test",
  },
  production: {
    ...common,
    use_env_variable: "DATABASE_URL",
    logging: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
