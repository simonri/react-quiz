import dotenv from "dotenv";
dotenv.config();

export default {
  host: process.env.HOST || "0.0.0.0",
  port: process.env.PORT || 5000,
  secrets: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  db: {
    url: process.env.MONGO_URI,
  },
  expire: {
    authToken: 3600,
  },
};
