const cors = require('cors');
var express = require("express");
var router = require('./route/route');
var adminRoute = require('./route/admin_route');
var database = require('./config/db');
var bodyParser = require('body-parser');
var expressFile = require('express-fileupload');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
app.use(cors());
app.use(expressFile());
const http = require("http");
const PORT = process.env.PORT || 3001

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', router);
app.use('/admin', adminRoute);

//default route
app.all('/', (req, res) => {
    return res.status(200).send("Connected... wohoo")
})

app.listen(PORT, () => {
    console.log('server is running on port ' + PORT)
})
