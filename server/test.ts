import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.listen(4000, () => {
  console.log("Running on port 4000");
});