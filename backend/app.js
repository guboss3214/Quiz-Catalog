require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/connection");
const questionnaireRoutes = require("./routes/questionnaireRouter");
const userResponseRouter = require("./routes/userResponseRouter");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT;

app.use("/api", questionnaireRoutes);
app.use("/api", userResponseRouter);

db();

app.listen(PORT, () => {
  console.log(`Server is running`);
});
