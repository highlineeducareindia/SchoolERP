const express = require('express');
const app = express();
const cors = require("cors");

// Enable CORS for all routes
app.use(cors());



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/superadmin", require("./routes/superAdmin/superAdminRoutes"));
app.use("/api/admin", require("./routes/Admin/schoolRoutes"));



module.exports = app;