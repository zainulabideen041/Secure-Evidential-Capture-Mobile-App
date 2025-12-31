const express = require("express");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./utils/db");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// IMPORTING ROUTES
const ScreenshotRoutes = require("./routes/Screenshot");
const AuthRoutes = require("./routes/Authentication");
const ImageRoute = require("./routes/ImageUpload");
const VideoRoute = require("./routes/VideoUpload");
const UserRoutes = require("./routes/User");
const CaseRoutes = require("./routes/Case");
const resetPassRoutes = require("./routes/forgotPassword");

app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/image", ImageRoute);
app.use("/video", VideoRoute);
app.use("/screenshot", ScreenshotRoutes);
app.use("/case", CaseRoutes);
app.use("/reset-pass", resetPassRoutes);

app.get("/", (req, res) => {
  res.json("Welcome to the Official Server");
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is now running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Failed to connect to database. Server not started.", error);
  });
