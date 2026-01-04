const path = require("path");
const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ path: path.join(__dirname, ".env") });


const apiRoutes = require("./routes/api"); // <-- важно

const app = express();
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api", apiRoutes); // <-- тут падало, если apiRoutes не router

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
