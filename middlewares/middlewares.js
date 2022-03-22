var jwt = require('jsonwebtoken');

exports.request = (req, res, next) => {
    console.log('Resquest => ', req.method, req.url, req.body);
    next()
}

exports.autenticacao = (req, res, next) => {
    var token = req.headers.auth;

    jwt.verify(token, '12707', (err, decoded) => {

        if (err) {
            res.send({ error: 'Token inválido!' + err });
        }

        
        //res.locals.auth_data = decoded;

        console.log('token ok!');
        next();
    });


}