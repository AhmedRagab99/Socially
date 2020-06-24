const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const keys = require("./keys");

require("./models/user");

mongoose.connect(
  keys.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to database");
  }
);


//routes
const authRoutes = require("./routes/auth");
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

// middleWares
dotenv.config();
app.use(express.urlencoded({
  extended: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use("/v1/auth", authRoutes);
app.use("/v1/post", postRoutes);
app.use("/v1/user", userRoutes);


app.listen(3000, () => {
  console.log(`server is running on 3000`);
});