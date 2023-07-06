const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("uncaughtException! Shutting down... ");
  console.log(err.name, err.message);
});

// to specify env path
dotenv.config({ path: "./config.env" });
const app = require("./app");
// to put password into DB
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
// to connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED Rejection! Shutting down... ");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1); // zero stands for success and one stands for uncaught exception);
  });
});
