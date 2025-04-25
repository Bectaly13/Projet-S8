const JWT = require('jsonwebtoken');
const fs = require('fs');

// Récupération des clés publique et privée
// Ces instructions ne sont exécutées qu'au démarrage du serveur
const RSA_PRIVATE_KEY = fs.readFileSync('../keys/jwtRS256.key');
const RSA_PUBLIC_KEY = fs.readFileSync('../keys/jwtRS256.key.pub');

// Crée et renvoie un nouveau JWT
function createJWT(userId) {
    // Le payload est l'identifiant de l'utilisateur
    // + un champ refreshTime
    // Quand on décodera je JWT, on aura accès à l'id de l'utilisateur.
    const jwtToken = JWT.sign(
        {
            userId: userId,
            refreshTime: Math.floor(Date.now() / 1000) + 2700 // Validité : 45min
        },
        RSA_PRIVATE_KEY,
        {
            algorithm: 'RS256',
            expiresIn: '1h' // Champ exp : validité 1h
        }
    );

    return jwtToken;
}
// La fonction n'est pas exécutée, elle reste interne

// Décode un cookie transmis dans une requête et renvoie les informations
// contenues dans ce cookie, ici le userId. Si le cookie n'existe pas ou
// si le token a expiré, la fonction renvoie juste un objet avec un
// userId égal à -1
function decodeSessionCookie(req) {
    // On suppose que le cookie de session contenant le JWT
    // s'appelle SESSIONID
    if(typeof req.cookies.SESSIONID === 'undefined') {
        return { userId: -1 };
    }

    // Ici, le cookie existe.
    const sessionid = req.cookies.SESSIONID;
    try {
        const token = JWT.verify(
            sessionid, // Le token
            RSA_PUBLIC_KEY, // La clé de déchiffrement
            {
                algorithms: ['RS256']
            }
        );

        return token; // Contient le payload du token
    } catch (err) {
        // Si le token a expiré, on renvoie un objet avec un userId
        // égal à -1
        return { userId: -1 };
    }
}

// sendSessionCookie envoie le cookie de session JWT au navigateur.
// payload correspond a ce qui a été retourné par decodeSessionCookie.
// Autrement dit, si celui-ci contient une propriété userId et une
// propriété refreshTime, cela correspond au contenu d'un token tranmis
// par le navigateur. S'il n'est pas trop vieux (encore loin de sa date
// d'expiration), on le renvoie, sinon on renvoie un cookie avec un
// nouveau token.
function sendSessionCookie(req, res, payload) {
    // On regarde si le payload provient bien d'un JWT transmis par le
    // navigateur. Si oui, il y a expiresIn. On pourrait
    // renvoyer le JWT du navigateur tant qu'on n'a pas atteint cette limite.
    // Mais si l'on est à 1s de cette date et qu'on renvoie le JWT du navigateur,
    // la prochaine fois que l'utilisateur tentera d'accéder au backend,
    // le JWT aura expiré et cela obligera l'utilisateur à se relogguer.
    // Pour pallier cela, refreshTime correspond à 15mn avant l'expiration
    // du JWT. Si on a dépassé refreshTime, on reconstruit un nouveau JWT.
    // Notez que cela a un coût (de chiffrement) et, donc, on veut éviter
    // de créer un nouveau JWT à chaque requête.
    let jwtToken = '';
    if(
        (typeof payload.userId !== 'undefined')
        &&
        (typeof payload.refreshTime !== 'undefined')
        &&
        (Math.floor(Date.now() / 1000) <= payload.refreshTime)
    ) {
        // Ici, on peut renvoyer le JWT que le navugateur avait transmis ;
        // il reste à l'utilisateur au moins 15min pour effectuer sa
        // prochaine requête.
        jwtToken = req.cookies.SESSIONID;
    } else {
        // On reconstruit un nouveau JWT.
        jwtToken = createJWT(payload.userId);
    }

    // On renvoie le cookie au client.
    // On met le secure à false afin de pouvoir utiliser http
    // (et non https) pour les tests.
    res.cookie('SESSIONID', jwtToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    });
}

module.exports.decodeSessionCookie = decodeSessionCookie;
module.exports.sendSessionCookie = sendSessionCookie;