require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/dbConnection/db');

// Connect to MongoDB
connectDB();


const PORT = process.env.PORT;





//Server connection
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});