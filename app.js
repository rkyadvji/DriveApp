const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.routes");
const indexRouter = require("./routes/index.routes");
const connectToDB = require("./config/db");

dotenv.config();
connectToDB();

const app = express();

// ✅ Middleware (correct order)
app.use(cors({
  origin: true,          // allow same-origin requests (Render)
  credentials: true      // allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ View engine
app.set("view engine", "ejs");

// ✅ Routes
app.use("/user", userRouter);
app.use("/", indexRouter);

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
