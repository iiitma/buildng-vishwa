require("dotenv").config();

module.exports = {
 MONGO_DB_URL: process.env.MONGO_DB_URL,
  PORT: process.env.APP_PORT,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  SUPER_SECRET: process.env.SUPER_SECRET,
  MAIN_APP_URL: process.env.MAIN_APP_URL,
  SUPER_ADMIN: process.env.SUPER_ADMIN,
};