const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "production",
  jwtSecret: process.env.JWT_SECRET || "some-secret-key",
  addressCors: process.env.CORS_ADDRESS || "http://localhost:3000",
  cacert: process.env.CACERT || "./.mongodb/root.crt",
  keyApiYoutube: process.env.KEY_API_YOUTUBE || "keyApi",
  useSsl: (process.env.USE_SSL || "true") === "true",
  useSslValidate: (process.env.USE_SSLVALIDATE || "true") === "true",
  dbURL: process.env.DB_URL || "mongodb://127.0.0.1:27017/kino-garage",
};
