require('dotenv').config();
const hostname = process.env.BACKEND_URL;
const port = 5000 | process.env.PORT;
const express = require('express');
const bodyParser = require('express');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', require('./routes/auth'));
app.use('/record', require('./routes/record'));

app.get('/', (req, res) => {
    res.send('alive :)');
})

app.listen(port, () => {
    console.log(`Server Is Running At ${hostname}:${port}`)
})