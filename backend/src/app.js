const express = require('express');
const app = express();



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/superadmin", require("./routes/superAdmin/superAdminRoutes"));
app.use("/api/admin", require("./routes/Admin/schoolRoutes"));



module.exports = app;