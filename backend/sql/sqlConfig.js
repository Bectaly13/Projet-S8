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
      sqlHost: "qmaxfrhpwsteam.mysql.db",
      sqlDatabase: "qmaxfrhpwsteam",
      charset: "utf8",
      sqlLogin: "qmaxfrhpwsteam",
      sqlPassword: "Max2Becker"
    }
};

module.exports.sqlHost = config.sqlHost;
module.exports.sqlDatabase = config.sqlDatabase;
module.exports.charset = config.charset;
module.exports.sqlLogin = config.sqlLogin;
module.exports.sqlPassword = config.sqlPassword;