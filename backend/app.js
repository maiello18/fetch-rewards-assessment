require("dotenv").config();

const express = require("express");
const fetchRouter = require("./routes/fetch");
const morgan = require("morgan");

const port = process.env.PORT;
const app = express();

app.use(morgan("tiny"));
app.use(express.json());

// Setup Routers
app.use("/v1/fetch/", fetchRouter);

// Start application
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
