const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const migrateRoute = require('../migrate')


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => { 
    res.send('Hello World!');
})

app.use('/migrate', migrateRoute)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { 
    console.log(`Server listening on port ${PORT}`)
})