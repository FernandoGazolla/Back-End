const express = require('express')
const res = require('express/lib/response')
var mongoose = require('mongoose')

var Produtos = require('./models/produto');
var Usuarios = require('./models/usuario');

const app = express()

var swaggerUI = require('swagger-ui-express');
var swaggerFile = require('./swagger_output.json');
const { dataConverter } = require('swagger-autogen/src/handle-data');


var url = 'mongodb+srv://admin:123@cluster0.3q6c6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
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


app.get('/', function (req, res) {
  // #swagger.tags = ['Root']   
  // #swagger.description = 'Root'

  res.send('Opa!')
})

//CRUD => Produto(codigo, nome, descrição)
//Create, Read, Update, delete

//C
app.post('/produtos', (req, res) => {
  // #swagger.tags = ['Produtos']   
  // #swagger.description = 'Incluir produtos'


  objetoProduto = req.body
  console.log(objetoProduto.codigo)

  var codigo = objetoProduto.codigo


  if (objetoProduto.codigo === undefined) {
    return res.status(500).send({ mensagem: 'O código é obrigatório!!' })
  }

  Produtos.findOne({ codigo }, (err, data) => {

    if (err) {
      console.log(data)
    }

    if (data) {
      console.log(data)
      return res.status(500).send({ mensagem: 'O código já existe!!' })
    }
    else {
      Produtos.create(req.body, (err, data) => {

        if (err) {
          console.log(err)
        }
        else {
          console.log(data)
          res.status(201).send({ mensagem: 'Produto criado com sucesso!!!' })
        }
      });

    }

  })

})

//R
app.get('/produtos/:codigo', (req, res) => {
  // #swagger.tags = ['Produtos']   
  // #swagger.description = 'Buscar produto'

  var codigo = req.params.codigo;

  Produtos.findOne({ codigo }, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).send({ mensagem: 'Erro ao buscar o registro!' })
    }
    else {
      if (data === null) {
        res.status(204).send({ mensagem: 'Registro não encontrado!' })
      }
      else {
        res.status(200).send(data)
      }
    }
  })
})

app.get('/produtos', (req, res) => {
  // #swagger.tags = ['Produtos']   
  // #swagger.description = 'Listar produto'
  Produtos.find({}, (err, data) => {
    res.status(200).send(data)
  })

})

//U
app.put('/produtos/:codigo', (req, res) => {
  // #swagger.tags = ['Produtos']   
  // #swagger.description = 'Alterar produto'

  var codigo = req.params.codigo;

  Produtos.findOneAndUpdate({ codigo }, { $set: req.body }, (err, data) => {
    if (err) {
      console.log(err)
      res.status(206).send();
    }
    else {
      res.status(201).send({
        mensagem: 'Tudo ok com a requisição para alterar produtos',
        codigo: 5004
      })
    }
  })
})

//D
app.delete('/produtos/:codigo', (req, res) => {
  // #swagger.tags = ['Produtos']   
  // #swagger.description = 'Excluir produto'

  var codigo = req.params.codigo;

  Produtos.findOneAndDelete({ codigo }, (err, data) => {
    if (err) {
      console.log(err)
      res.status(206).send();
    }
    else {
      res.status(200).send(
        {
          mensagem: 'Tudo ok com a requisição para excluir produtos',
          codigo: 5003
        }
      )
    }
  })
})


app.post('/usuarios', (req, res) => {
  // #swagger.tags = ['Usuários']   
  // #swagger.description = 'Incluir usuário'


  Usuarios.create(req.body, (err, data) => {

    if (err) {
      console.log(err)
    }
    else {
      console.log(data)
      res.status(201).send({ mensagem: 'Usuário criado com sucesso!!!' })
    }
  });


})

//R
app.post('/usuarios/login', (req, res) => {
  // #swagger.tags = ['Usuários']   
  // #swagger.description = 'Gerar token'

  var login = req.body.login
  var senha = req.body.senha

  Usuarios.findOne({ login, senha }, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).send({ mensagem: 'Erro ao autenticar usuário!' })
    }
    else {
      if (data === null) {
        res.status(204).send({ mensagem: 'Usuário não encontrado!' })
      }
      else {
        res.status(200).send(data)
      }
    }
  })
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(express.static('public'));

app.listen(3000)