var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://achyut:crossover@ds155097.mlab.com:55097/crossoverapp');

//var db = mongoose.connection;

var ProductSchema = mongoose.Schema({

    imgUrl: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    rating: {
        type: Number
    },
    binding: {
        type: String
    },
    publisher: {
        type: String
    },
    releaseDate: {
        type: String
    },
    details: {
        type: String
    }
});

var Product = module.exports = db.model('Product', ProductSchema);

module.exports.getAllProducts = function (callback) {
    Product.find({}, callback);
}

module.exports.getProductById = function (id, callback) {
    console.log('Product by id ' + id);
    Product.findById(id, callback);
}