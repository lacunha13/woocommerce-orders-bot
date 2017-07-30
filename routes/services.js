
'use strict';

const bot = require('../modules/wcbot');
const express = require('express');
const router = express.Router();

router.get('/list/:rpp/:page/:status?/:search?',
  function(req, res, next) {
    var status = req.params.status || 'any';
    bot.api.orders.list(status, req.params.search, req.params.page, req.params.rpp)
      .then((data) => res.json(data));
  }
);

router.get('/detail/:id',
  function(req, res, next) {
    bot.api.orders.details(req.params.id)
      .then((data) => res.json(data));
  }
);

router.get('/notes/:id',
  function(req, res, next) {
    bot.api.orders.notes(req.params.id)
      .then((data) => res.json(data));
  }
);

router.post('/status/:id/:status',
  function(req, res, next) {
    bot.api.orders.updateStatus(req.params.id, req.params.status)
      .then((data) => res.json(data));
  }
);

router.post('/reminder/pay/:id',
  function(req, res, next) {
    bot.api.orders.addPendingPaymentNote(req.params.id)
      .then((data) => res.json(data));
  }
);

module.exports = router;