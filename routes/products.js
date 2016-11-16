var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

router.get('/all-products', function (req, res) {
    
    Product.getAllProducts(function (err, product) {
        if (err) throw err;

        console.log('from routes ' + product);
        res.json(product);
    });
    
});

router.get('/add-to-cart/:id', function (req, res) {
    var productId = req.params.id;
    console.log(productId);
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.getProductById(productId, function (err, product) {
        if (err) {
            res.redirect('/');
        }

        cart.add(product, productId);

        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/reduce/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);

    req.session.cart = cart;
    res.redirect('/products/my-cart');
});

router.get('/remove-item/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);

    req.session.cart = cart;
    res.redirect('/products/my-cart');
});

router.get('/my-cart', isLoggedIn, function (req, res) {
    if (!req.session.cart) {
        return res.render('shopping-cart', { title: 'Your Cart', user: req.user, products: null });
    }
    var cart = new Cart(req.session.cart);
    res.render('shopping-cart', { title:'Your Cart',user: req.user, products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedIn, function (req, res) {
    if (!req.session.cart) {
        return res.redirect('./my-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('checkout', { title: 'Checkout', user: req.user, errMsg: errMsg, noError: !errMsg, totalPrice: cart.totalPrice });

});

router.post('/checkout', isLoggedIn, function (req, res) {

    if (!req.session.cart) {
        return res.redirect('products/my-cart');
    }

    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_wZfbLxB0sxmn3DlCJ0YCrJVP"
    );

    stripe.charges.create({
        amount: cart.totalPrice*100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Charge for " + req.user.name
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/products/checkout');
        }

        var order = new Order({
            user: req.user,
            cart:cart,
            name: req.body.name,
            address: req.body.address,
            paymentId: charge.id
        });

        Order.createOrder(order, function (err, result) {
            if (err) throw err;
            req.flash('success', 'Your order has been placed.Thank you.');
            req.session.cart = null;
            res.redirect('/');
        });
        
    });
    
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}