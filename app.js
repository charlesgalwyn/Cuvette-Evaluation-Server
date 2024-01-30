const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const quizeRoutes = require('./routes/quizeRoutes');
const errorHandler = require('./utils/errorHandler')

// Enable CORS for some routes routes
const allowedOrigins = ['http://localhost:5173', '*'];

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

//using middlewares
app.use(express.json());


app.use('/api/user', userRoutes);
app.use('/api/quiz', quizeRoutes);

app.use(errorHandler);

module.exports = app;