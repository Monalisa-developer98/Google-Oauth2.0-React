require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4343;
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database/dbConnection');
const mainRouter = require('./routes/userRoutes');
const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
connectDB();

app.use(
    session({
        secret: 'monalisa',
        resave: false,
        saveUninitialized: true,
    })
);

app.use('/api', mainRouter);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(port, (err)=>{
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
})