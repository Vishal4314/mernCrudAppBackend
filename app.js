require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./Routes/router");

require("./db/conn");

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("./uploads"));
app.use("/files", express.static("./public/files"));
app.use(router);

app.listen(port, () => {
  console.log(`Backend started at port: ${port}`);
});

app.get("/", async (req, res) => {
  res.send("Reached backend");
});
