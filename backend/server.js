// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body Parser Middleware
app.use(express.json());

// Define Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/emergency-contacts', require('./routes/emergencyContactRoutes'));

app.use("/createAppointment",(req,res,next)=>{               //api: /createAppontment
  console.log(`Request received : ${req.method}: ${req.url}`);
  next();
},require("./routes/appointmentRoute"));

app.use("/getAppointment",(req,res,next)=>{               //api: /getAppontment/me
  console.log(`Request received : ${req.method}: ${req.url}`);
  next();
},require("./routes/appointmentRoute"));

app.use("/deleteAppointment",(req,res,next)=>{               //api: /deleteAppontment/delete/:id
  console.log(`Request received : ${req.method}: ${req.url}`);
  next();
},require("./routes/appointmentRoute"));

app.use("/createDonor",(req,res,next)=>{               //api: /createDonor
  console.log(`Request received : ${req.method}: ${req.url}`);
  next();
},require("./routes/donorRoute"));

app.use("/readDonor",(req,res,next)=>{               //api: /readDonor/read
  console.log(`Request received : ${req.method}: ${req.url}`);
  next();
},require("./routes/donorRoute"));

app.use("/getDonorId",(req,res,next)=>{               //api: /getDonorId/get/:id
  console.log(`Request received : ${req.method}: ${req.url}`);
  next();
},require("./routes/donorRoute"));

app.use("/updateDonor",(req,res,next)=>{               //api: /updateDonor/update/:id
  console.log(`Request received : ${req.method}: ${req.url}`);
  next();
},require("./routes/donorRoute"));

app.use("/deleteDonor/delete/:id",(req,res,next)=>{              //api: /deleteDonor/delete/:id
  console.log(`Request received : ${req.method}: ${req.url}`);
  next();
},require("./routes/donorRoute"));

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 