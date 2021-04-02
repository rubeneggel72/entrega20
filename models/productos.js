
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productoSchema = new Schema({
  productoId: {
    type: Number
  },
  title: {
    type: String
  },
  price: {
    type: Number
  },
  stock: {
    type: Number
  },
  thumbnail: {
    type: String
  },
  date: { type: Date, default: Date.now }
}, { collection: 'productos' });

productoSchema.plugin(AutoIncrement, { id: 'productoId_seq', inc_field: 'productoId' });

module.exports = mongoose.model('productoDb', productoSchema);