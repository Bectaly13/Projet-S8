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

const getSectors = require("./scripts/getSectors").getSectors;
app.post("/getSectors", (request, result) => {getSectors(request, result);});

const getSectorName = require("./scripts/getSectorName").getSectorName;
app.post("/getSectorName", (request, result) => {getSectorName(request, result);});

const getDomains = require("./scripts/getDomains").getDomains;
app.post("/getDomains", (request, result) => {getDomains(request, result);});

const getChapters = require("./scripts/getChapters").getChapters;
app.post("/getChapters", (request, result) => {getChapters(request, result);});

const getValidStudyQuestions = require("./scripts/getValidStudyQuestions").getValidStudyQuestions;
app.post("/getValidStudyQuestions", (request, result) => {getValidStudyQuestions(request, result);});

const getQuestionChoices = require("./scripts/getQuestionChoices").getQuestionChoices;
app.post("/getQuestionChoices", (request, result) => {getQuestionChoices(request, result);});

const getQuestionImages = require("./scripts/getQuestionImages").getQuestionImages;
app.post("/getQuestionImages", (request, result) => {getQuestionImages(request, result);});

const getSkills = require("./scripts/getSkills").getSkills;
app.post("/getSkills", (request, result) => {getSkills(request, result);});

const getValidLearnQuestions = require("./scripts/getValidLearnQuestions").getValidLearnQuestions;
app.post("/getValidLearnQuestions", (request, result) => {getValidLearnQuestions(request, result);});

const getQuestionCount = require("./scripts/getQuestionCount").getQuestionCount;
app.post("/getQuestionCount", (request, result) => {getQuestionCount(request, result);});

app.listen(port, host, () => {console.log (`Listening to http://${host}:${port}`);});