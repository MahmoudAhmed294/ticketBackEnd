if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  FRONT_HOST: process.env.FRONT_HOST,
  dialect: "mssql",
  token: process.env.TOKEN,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
