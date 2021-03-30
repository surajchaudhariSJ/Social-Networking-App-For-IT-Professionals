const express = require('express');
const app = express();  //initializing app variable with express

const connectDB = require('./config/db');

//connect to the database
connectDB();

//Init Middleware
app.use(express.json({ extended: false})); //it allow us to get data in req.body

app.get('/', (req, res) => res.send('API Running...')); 

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT =  5000;  //declaring port number
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  //passing PORT and displaying info msg