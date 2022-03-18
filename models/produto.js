var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProdutoSchema = Schema({
    codigo: { type: String, require: true, unique: true },
    nome: { type: String, require: true },
    descricao: { type: String },
    margemLucro: { type: Number, default: 10 },
    dataCriacao: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Produto', ProdutoSchema);