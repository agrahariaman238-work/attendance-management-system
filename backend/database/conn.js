const mongoose = require("mongoose");
require("dotenv").config();

const MONGOURI = process.env.MONGOURI;

const Connection = () => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(MONGOURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("connection successfull .."))
    .catch((err) => console.log("error is ----- >>>>> ------ \n", err));
};
Connection();
