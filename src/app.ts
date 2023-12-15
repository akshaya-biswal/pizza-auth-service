import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Auth services");
});

export default app;
