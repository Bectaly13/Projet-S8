const express = require('express');

const app = express();
const host = "127.0.0.1";
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const cors = require('cors');
const corsOptions = {
    origin: "http://127.0.0.1:8100",
    credentials: true,
};
app.use(cors(corsOptions));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const getSectors = require("./getSectors").getSectors;
app.post("/getSectors", (request, result) => {getSectors(request, result);});

app.listen(port, host, () => {console.log (`Listening to http://${host}:${port}`);});