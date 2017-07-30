
'use strict';

const _ = require("lodash");

function Orders(response) {
  this.orders = _.map(response, o => new Order(o));
  //TODO set pagination info?
}

function Order(wcOrder) {

  function Product(wcProduct) {
    this.id = wcProduct.variation_id || wcProduct.product_id;
    this.quantity = wcProduct.quantity;
    this.total = wcProduct.subtotal;
    this.metadata = _.map(wcProduct.meta_data, m => {return {key:m.key, val: m.value}});
  }

  function vat(){
    var m = _.find(wcOrder.meta_data, ['key', '_vat_number']);
    return m ? m.value : null;
  }

  this.number = wcOrder.number;
  this.date_gmt = wcOrder.date_created_gmt;
  this.status = wcOrder.status;
  this.addr = {
    shipping: wcOrder.shipping,
    billing: wcOrder.billing
  };

  this.payment = {
    method: wcOrder.payment_method_title,
    total: wcOrder.total,
    shipping: wcOrder.shipping_total,
    date_gmt: wcOrder.date_paid_gmt,
    vat: vat()
  };
  this.products = _.map(wcOrder.line_items, p => new Product(p));
  this.coupons = _.map(c => c.code);
  this.fees = _.map(f => f.code);
  this.customer_note = wcOrder.customer_note;

}

module.exports.orders = function(response) {
  return new Orders(response);
};

module.exports.detail = function(response) {
  return new Order(response);
};

module.exports.notes = function(response) {
  //return new Notes(response);
};

