const mongoose = require("mongoose");

const URI = process.env.DATABASE;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error connecting database", err);
  });
