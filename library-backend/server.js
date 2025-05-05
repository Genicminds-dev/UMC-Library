const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const navMenuRoutes = require("./Routes/navMenuRoutes");
const loginRoutes = require("./Routes/loginRoutes");
const userRoutes = require("./Routes/userRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");

app.use("/api/navmenu", navMenuRoutes);
app.use("/api", loginRoutes);
app.use("/api", userRoutes);
app.use("/api", notificationRoutes);

const PORT = 5505;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
