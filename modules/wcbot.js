
const props = require('./properties');

const WooCommerceAPI = require('woocommerce-api');

const WooCommerce = new WooCommerceAPI({
    url: props.wcbot.url,
    consumerKey: props.wcbot.key,
    consumerSecret: props.wcbot.secret,
    wpAPI: true,
    version: props.wcbot.version
});

function Api() {

    function Orders() {
        var self = this;
        self.list = function list(status, search, page, rpp) {
            /*X-WP-Total and X-WP-TotalPages HTTP headers*/

            var path = 'orders?';
            path += status ? 'status=' + status : '';
            path += search ? 'search=' + search : '';
            path += page ? 'page=' + page : '';
            path += 'per_page=' + rpp ? rpp : props.wcbot.options.pagination;

            WooCommerce.getAsync(path)
                .then(function(err, data, res) {
                    console.log(res);
            });

        };

        self.details = function details(id) {
            WooCommerce.getAsync('orders/' + id)
                .then(function(err, data, res) {
                    console.log(res);
                });
        };

        self.updateStatus = function(id, status) {
            WooCommerce.putAsync('orders/' + id, {status: status})
                .then(function(err, data, res){
                    console.log(res);
                });
        };

        self.notes = function(id) {
            WooCommerce.getAsync('orders/' + id +'/notes')
                .then(function(err, data, res) {
                    console.log(res);
                });
        };

        self.addPendingPaymentNote = function(id) {
            var msg = props.wcbot.options.pendingpayment;
            WooCommerce.postAsync('orders/' + id +'/notes', {note:msg})
                .then(function(err, data, res) {
                    console.log(res);
                });
        };
    }

    this.orders = new Orders();

}

module.exports.api = new Api();
