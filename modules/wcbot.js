
'use strict';

const Promise = require("promise");
const properties = require('./properties');

const model = require('../models/orders');

const WooCommerceAPI = require('woocommerce-api');

properties().then(function(props) {

    const WooCommerce = new WooCommerceAPI({
        url: props.wcbot.url,
        consumerKey: props.wcbot.key,
        consumerSecret: props.wcbot.secret,
        wpAPI: true,
        version: props.wcbot.version
    });

    function Api() {

        function WcSuccess(res) {
          this.data = res;
        }

        function WcError(err, data) {
          this.err = err;
          this.data = data;
          console.error(err);
        }

        function Orders() {
            const self = this;

            self.list = function list(status, search, page, rpp) {
                /*X-WP-Total and X-WP-TotalPages HTTP headers*/

                var path = 'orders?';
                path += status ? 'status=' + status : '';
                path += search ? '&search=' + search : '';
                path += page ? '&page=' + page : '';
                path += '&per_page=' + (rpp ? rpp : props.common.pagination);

                return new Promise((fulfill, reject) => {
                  WooCommerce.get(path, function(err, data, res) {
                    if (err) {
                      return reject(new WcError(err, data));
                    } else{
                      return fulfill(new WcSuccess(model.orders(JSON.parse(res))));
                    }
                  });
                });
            };

            self.details = function details(id) {
              return new Promise((fulfill, reject) => {
                WooCommerce.get('orders/' + id,
                  function(err, data, res) {
                    if (err) {
                      return reject(new WcError(err, data));
                    } else {
                      return fulfill(new WcSuccess(model.detail(JSON.parse(res))));
                    }
                });
              });
            };

            //Order status. Options:
            // pending, processing, on-hold, completed, cancelled, refunded and failed. Default is pending
            self.updateStatus = function(id, status) {
              return new Promise((fulfill, reject) => {
                WooCommerce.put('orders/' + id, {status: status},
                  function (err, data, res) {
                    if (err) {
                      return reject(new WcError(err, data));
                    } else {
                      return fulfill(new WcSuccess(true));
                    }
                  });
              });
            };

            self.notes = function(id) {
              return new Promise((fulfill, reject) => {
                WooCommerce.get('orders/' + id + '/notes',
                  function (err, data, res) {
                    if (err) {
                      return reject(new WcError(err, data));
                    } else {
                      return fulfill(new WcSuccess(model.notes(JSON.parse(res))));
                    }
                  });
              });
            };

            self.addPendingPaymentNote = function(id) {
              return new Promise((fulfill, reject) => {
                var msg = props.messages.pendingpayment;
                WooCommerce.post('orders/' + id + '/notes', {note: msg, customer_note: true},
                  function (err, data, res) {
                    if (err) {
                      return reject(new WcError(err, data));
                    }else {
                      return fulfill(new WcSuccess(true));
                    }
                  });
              });
            };
        }

        this.orders = new Orders();

    }

    module.exports.api = new Api();

});

