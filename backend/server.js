// Create and config the Express server.
const express = require('express');

const app = express();
const host = "127.0.0.1";
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const cors = require('cors');
const corsOptions = {
    // Use frontend address here.
    origin: "http://127.0.0.1:8100",
    credentials: true,
};
app.use(cors(corsOptions));

// This server address allows the frontend to fetch images.
const path = require('path');
app.use('/data', express.static(path.join(__dirname, 'data')));

// All server addresses, allowing to use the methods defined in this backend.
// Each script file needs its own address.
const getSectors = require("./scripts/getSectors").getSectors;
app.post("/getSectors", (request, result) => {getSectors(request, result);});

const getDomains = require("./scripts/getDomains").getDomains;
app.post("/getDomains", (request, result) => {getDomains(request, result);});

const getChapters = require("./scripts/getChapters").getChapters;
app.post("/getChapters", (request, result) => {getChapters(request, result);});

const getValidStudyQuestions = require("./scripts/getValidStudyQuestions").getValidStudyQuestions;
app.post("/getValidStudyQuestions", (request, result) => {getValidStudyQuestions(request, result);});

const getChoices = require("./scripts/getChoices").getChoices;
app.post("/getChoices", (request, result) => {getChoices(request, result);});

const getImages = require("./scripts/getImages").getImages;
app.post("/getImages", (request, result) => {getImages(request, result);});

const getSkills = require("./scripts/getSkills").getSkills;
app.post("/getSkills", (request, result) => {getSkills(request, result);});

const getValidLearnQuestions = require("./scripts/getValidLearnQuestions").getValidLearnQuestions;
app.post("/getValidLearnQuestions", (request, result) => {getValidLearnQuestions(request, result);});

const getQuestionCount = require("./scripts/getQuestionCount").getQuestionCount;
app.post("/getQuestionCount", (request, result) => {getQuestionCount(request, result);});

const getDefaultQuestionsData = require("./scripts/getDefaultQuestionsData").getDefaultQuestionsData;
app.post("/getDefaultQuestionsData", (request, result) => {getDefaultQuestionsData(request, result);});

// Start server and display its address in the backend console.
app.listen(port, host, () => {console.log (`Listening to http://${host}:${port}`);});