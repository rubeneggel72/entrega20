const express = require('express');
const Producto = require('../models/productos');

const productoRouter = express.Router();

productoRouter
  .route('/')
  .post(function (request, response) {

    console.log('POST /productos');

    var item = new Producto(request.body);

    item.save();

    response.status(201).send(item);
  })
  .get(function (request, response) {

    console.log('GET /productos');

    Producto.find(function (error, items) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(items);

      response.json(items);
    });
  });

productoRouter
  .route('/:id')
  .get(function (request, response) {

    console.log('GET /productos/:id');

    var itemId = request.params.id;

    Producto.findOne({ ProductoId: itemId }, function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(item);

      response.json(item);

    });
  })
  .put(function (request, response) {

    console.log('PUT /productos/:id');

    var itemId = request.params.id;

    Producto.findOne({ ProductoId: itemId }, function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {
        item.message = request.body.message;
        item.username = request.body.username;
        item.save();

        response.json(item);
        return;
      }

      response.status(404).json({
        message: 'productos con id ' + itemId + ' no fue encontrado.'
      });
    });
  })
  .patch(function (request, response) {

    console.log('PATCH /productos/:itemId');

    var itemId = request.params.id;

    Producto.findOne({ ProductoId: itemId }, function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {

        for (var property in request.body) {
          if (request.body.hasOwnProperty(property)) {
            if (typeof item[property] !== 'undefined') {
              item[property] = request.body[property];
            }
          }
        }

        item.save();

        response.json(item);
        return;
      }

      response.status(404).json({
        message: 'productos con id ' + itemId + ' no fue encontrado.'
      });
    });
  })
  .delete(function (request, response) {

    console.log('DELETE /productos/:id');

    var itemId = request.params.id;

    Producto.findOne({ ProductoId: itemId }, function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {
        item.remove(function (error) {

          if (error) {
            response.status(500).send(error);
            return;
          }

          response.status(200).json({
            message: 'productos con id ' + itemId + ' fue borrado.'
          });
        });
      } else {
        response.status(404).json({
          message: 'productos con id ' + itemId + ' no fue encontrado.'
        });
      }
    });
  });

module.exports = productoRouter;