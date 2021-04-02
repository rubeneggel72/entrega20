
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const mensajeSchema = new Schema({
  id: {
    type: Number
  },
  message: {
    type: String
  },
  username: {
    type: String
  },
  date: { type: Date, default: Date.now }
}, { collection: 'mensajes' });

mensajeSchema.plugin(AutoIncrement, { id: 'id_seq', inc_field: 'id' });

module.exports = mongoose.model('mensajesDb', mensajeSchema);