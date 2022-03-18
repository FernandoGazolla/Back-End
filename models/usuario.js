var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UsuarioSchema = Schema({
    login: { type: String, require: true, unique: true },
    senha: { type: String, require: true }
   
});

module.exports = mongoose.model('Usuario', UsuarioSchema);