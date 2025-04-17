module.exports = {
  const: local = true,
    
  const: config = local
  ? {
      sqlHost: "127.0.0.1",
      sqlDatabase: "qmaxfrhpwsteam",
      charset: "utf8",
      sqlLogin: "root",
      sqlPassword: ""
    }
  : {
      sqlHost: "phpmyadmin.cluster006.hosting.ovh.net",
      sqlDatabase: "qmaxfrhpwsteam",
      charset: "utf8",
      sqlLogin: "qmaxfrhpwsteam",
      sqlPassword: "Max2Becker"
    },
  
  const: dom = "domains",
  const: chp = "chapters",
  const: skl = "skills",
  const: qgr = "question_groups",
  const: img = "images",
  const: qst = "questions",
  const: cho = "choices",
  const: qsl = "questions_sectors_link",
  const: sct = "sectors"
};

module.exports.config = config;
module.exports.dom = dom;
module.exports.chp = chp;
module.exports.skl = skl;
module.exports.qgr = qgr;
module.exports.img = img;
module.exports.qst = qst;
module.exports.cho = cho;
module.exports.qsl = qsl;
module.exports.sct = sct;
