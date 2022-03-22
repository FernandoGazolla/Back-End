const express = require('express')
const res = require('express/lib/response')
var mongoose = require('mongoose')

var Produtos = require('./models/produto');
var Usuarios = require('./models/usuario');

var routeProduto = require('./routes/produto');

const app = express()

var swaggerUI = require('swagger-ui-express');
var swaggerFile = require('./swagger_output.json');
const { dataConverter } = require('swagger-autogen/src/handle-data');


var url = 'mongodb+srv://gazolla:Riro2725@cluster0.76ogz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const options = {
    poolSize: 5,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
};

mongoose.connect(url, options);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
    console.log('Ok, conectado ao mongodb!!!')
})

mongoose.connection.on('error', (err) => {
    console.log('Erro ao conectar ao mongodb!!!', err)
})

mongoose.connection.on('disconnected', () => {
    console.log('Fechou a conexão com o banco!!!')
})



app.use(express.json());

app.post('/usuarios', (req, res) => {
    // #swagger.tags = ['Usuários']   
    // #swagger.description = 'Incluir usuário'


    Usuarios.create(req.body, (err, data) => {

        if (err) {
            console.log(err)
        } else {
            console.log(data)
            res.status(201).send({ mensagem: 'Usuário criado com sucesso!!!' })
        }
    });


})

//R
app.post('/usuarios/:login', (req, res) => {
    // #swagger.tags = ['Usuários']   
    // #swagger.description = 'Gerar token'

    var login = req.body.login
    var senha = req.body.senha

    Usuarios.findOne({ login, senha }, (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send({ mensagem: 'Erro ao autenticar usuário!' })
        } else {
            if (data === null) {
                res.status(204).send({ mensagem: 'Usuário não encontrado!' })
            } else {
                res.status(200).send(data)
            }
        }
    })
})

app.use('/produtos', middlewares.autenticacao, routeProduto);
app.use('/produtos', routeProduto);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(express.static('public'));

app.listen(process.env.PORT || 3000);