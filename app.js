const express = require("express");
const cors = require("cors");
const Router = require("./routes/routes");
const connectToDatabase = require("./config/db");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectToDatabase();

app.use(express.json());

app.use("/api", Router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
