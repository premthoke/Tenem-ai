const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Tenem API running...");
});

// AI chat route
app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
