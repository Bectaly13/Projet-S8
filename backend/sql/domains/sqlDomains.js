const mysqlConnect = require("../sqlConnect");
const dom = require("../sqlConfig").dom;

async function getDomainName(numero) {
    const requete = `SELECT name
        FROM ${dom}
        WHERE domainId = ?`;
    const data = [numero];
    return mysqlConnect.query(requete, data);
}

module.exports.getDomainName = getDomainName;