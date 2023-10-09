const express = require("express");
// const helmet = require("helmet");
const cors = require("cors");

const mongoose = require("mongoose");
const { errors } = require("celebrate");
// const { url } = require('./connect');
const { cacert, addressCors, useSsl, useSslValidate, dbURL } = require("./config");
const { requestLogger, errorLogger } = require("./middlewares/logger");
// const { addressCors,  } = require('./config');
const router = require("./routes/index");
const limiter = require("./middlewares/rateLimit");

const handleError = require("./middlewares/handleError");

mongoose.set("strictQuery", false);

const app = express();
// app.use(helmet());
app.use(express.json());
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    ssl: useSsl,
    sslValidate: useSslValidate,
    sslCA: useSsl ? cacert : undefined,
  })
  .then(() => console.log("mongodb is connected"))
  .catch(err => console.log(err));
app.use(
  cors({
    origin: [addressCors, "http://localhost:3000"],
  }),
);
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

module.exports = app;
