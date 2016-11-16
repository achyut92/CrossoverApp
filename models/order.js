var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://achyut:crossover@ds155097.mlab.com:55097/crossoverapp');
var Schema = mongoose.Schema;

//var db = mongoose.connection;

var OrderSchema = mongoose.Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        type: Object,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    }
});

var Order = module.exports = db.model('Order', OrderSchema);

module.exports.createOrder = function (order, callback) {
    order.save(callback);
}

module.exports.getAllOrdersByUser = function (user, callback) {
    Order.find({ user: user }).sort({ _id: -1 }).exec(callback);
}