// This file is used to config database connection,
// by initializing some variables.
// It is required in the sqlConnect.js file.

module.exports = { 
  // config contains what is needed to connect to the database.   
  config:
  {
    sqlHost: "127.0.0.1",
    sqlDatabase: "qmaxfrhpwsteam",
    charset: "utf8",
    sqlLogin: "root",
    sqlPassword: ""
  },
  
  // These variables allow the database admins to edit the tables' names
  // without altering the way SQL queries work.
  dom: "domains",
  chp: "chapters",
  skl: "skills",
  qgr: "question_groups",
  img: "images",
  qst: "questions",
  cho: "choices",
  qsl: "questions_sectors_link",
  sct: "sectors"
};